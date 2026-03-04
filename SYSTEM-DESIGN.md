# SpinShot — System Design

> Technical reference for the SpinShot party game architecture.

---

## Part A — High-Level Overview

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (React 19)                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Welcome   │  │ Create/  │  │ Lobby    │  │ Game       │  │
│  │ Page      │  │ Join     │  │ Page     │  │ Page       │  │
│  │           │  │ Pages    │  │          │  │            │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
│        │              │             │              │          │
│        └──────────────┴─────────────┴──────────────┘          │
│                          │                                    │
│  ┌───────────────────────┴────────────────────────────────┐  │
│  │                    Zustand Stores                       │  │
│  │  gameStore (game state)  ·  playerStore (local player)  │  │
│  └───────────────────────┬────────────────────────────────┘  │
│                          │                                    │
│  ┌───────────────────────┴────────────────────────────────┐  │
│  │              Supabase Client (Phase 2)                  │  │
│  │  React Query (rooms, players)  ·  Realtime Channels     │  │
│  └───────────────────────┬────────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │      Supabase          │
              │                        │
              │  ┌──────────────────┐  │
              │  │  PostgreSQL      │  │
              │  │  rooms           │  │
              │  │  players         │  │
              │  │  game_results    │  │
              │  └──────────────────┘  │
              │                        │
              │  ┌──────────────────┐  │
              │  │  Realtime        │  │
              │  │  Channels        │  │
              │  │  Presence        │  │
              │  │  Broadcast       │  │
              │  └──────────────────┘  │
              └────────────────────────┘
```

### Multiplayer Model

```
Host Client                          Player Clients
┌──────────────────┐                ┌──────────────────┐
│  Game Logic       │                │  Render Only      │
│  - Turn rotation  │   Broadcast    │  - Listen to      │
│  - Mission select │ ─────────────► │    game events     │
│  - Score tracking │   (channel)    │  - Display state   │
│  - Chaos events   │                │  - Send actions    │
│  - Timer          │ ◄───────────── │    (complete/fail) │
└──────────────────┘   User Action   └──────────────────┘
```

**Host authority**: The host client is the single source of truth. It runs all game logic and broadcasts state changes. Other clients listen and render. If the host disconnects, the first remaining player (by join order) becomes the new host via Presence.

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI | React 19 + TypeScript (strict) | Component framework |
| Build | Vite 7 | Dev server + bundler |
| Styling | Tailwind CSS v4 | CSS-first config, neon theme |
| Client State | Zustand 5 | Game state + player info |
| Server State | React Query 5 (Phase 2) | Room/player CRUD |
| Routing | React Router 7 | BrowserRouter (web), MemoryRouter (native) |
| Animation | Framer Motion | Wheel spinner, cards, transitions |
| i18n | i18next + react-i18next | Hebrew/English + RTL |
| Backend | Supabase | Postgres + Realtime + Presence |
| Native | Capacitor 8 (Phase 5) | iOS + Android |
| Deploy | Vercel | Frontend hosting |

---

## Part B — Database Schema

### Tables

```sql
-- Rooms: one per game session
CREATE TABLE rooms (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code       text UNIQUE NOT NULL,          -- 6-char room code (e.g. "AB3K7M")
  host_id    text NOT NULL,                 -- player UUID who created the room
  language   text NOT NULL DEFAULT 'en',    -- 'en' | 'he'
  game_length int NOT NULL DEFAULT 20,      -- minutes (20 or 30)
  status     text NOT NULL DEFAULT 'waiting', -- 'waiting' | 'playing' | 'finished'
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz,
  settings   jsonb DEFAULT '{"chaos_enabled": true}'::jsonb
);

-- Players: joined to a room
CREATE TABLE players (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id              uuid REFERENCES rooms(id) ON DELETE CASCADE,
  name                 text NOT NULL,
  shots                int DEFAULT 0,
  challenges_completed int DEFAULT 0,
  challenges_failed    int DEFAULT 0,
  fail_streak          int DEFAULT 0,
  is_host              boolean DEFAULT false,
  joined_at            timestamptz DEFAULT now(),
  UNIQUE(room_id, name)
);

-- Game Results: saved at game end
CREATE TABLE game_results (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     uuid REFERENCES rooms(id) ON DELETE CASCADE,
  results     jsonb NOT NULL,   -- { players: Player[], titles: Award[] }
  finished_at timestamptz DEFAULT now()
);
```

### Row Level Security (No Auth MVP)

```sql
-- Public access — no auth required in MVP
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rooms_public" ON rooms FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "players_public" ON players FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "results_public" ON game_results FOR ALL USING (true) WITH CHECK (true);
```

### Indexes

```sql
CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_players_room_id ON players(room_id);
```

---

## Part C — Realtime Architecture

### Channel Structure

Each room uses a single Supabase channel: `room:{CODE}`

```typescript
const channel = supabase.channel(`room:${roomCode}`, {
  config: { presence: { key: playerId } },
});
```

### Presence (Online Players)

```typescript
// Track player presence
channel.on("presence", { event: "sync" }, () => {
  const state = channel.presenceState();
  // Update player list from presence state
});

// Join with player info
channel.subscribe(async (status) => {
  if (status === "SUBSCRIBED") {
    await channel.track({ name, playerId, isHost });
  }
});
```

### Broadcast Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `game_start` | Host → All | `GameState` | Host starts the game |
| `spin_result` | Host → All | `{ category }` | Wheel spin result |
| `mission_assigned` | Host → All | `{ mission, playerId }` | Mission for current player |
| `mission_complete` | Player → Host | `{ playerId }` | Player completed mission |
| `mission_fail` | Player → Host | `{ playerId, shots }` | Player failed, drinks assigned |
| `turn_change` | Host → All | `{ playerIndex }` | Next player's turn |
| `chaos_event` | Host → All | `{ event }` | Chaos event triggered |
| `game_end` | Host → All | `{}` | Game over |

### Host Failover

```
1. Host disconnects → Presence removes host from state
2. All clients detect host absence via presence "leave" event
3. First player in join order (lowest joined_at) becomes new host
4. New host updates room.host_id in DB
5. New host resumes game logic from last known state
```

---

## Part D — Frontend Architecture

### Routes

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | WelcomePage | No |
| `/create` | CreateGamePage | No |
| `/join` | JoinGamePage | No |
| `/lobby/:code` | LobbyPage | No |
| `/game/:code` | GamePage | No |
| `/results/:code` | ResultsPage | No |

### Component Tree

```
App
├── WelcomePage
│   ├── Logo                    # Animated neon title
│   ├── AgeDisclaimer           # 18+ modal (localStorage gated)
│   ├── HowToPlay               # Rules modal
│   └── LanguageToggle           # en ↔ he switch
├── CreateGamePage
│   └── Card (form: name, language, game length)
├── JoinGamePage
│   └── Card (form: name, room code)
├── LobbyPage
│   ├── RoomCodeDisplay          # Code with copy-to-clipboard
│   ├── GameSettings             # Language + duration badges
│   └── PlayerJoinList           # Animated player list (Presence)
├── GamePage
│   ├── Timer                    # Countdown (mm:ss)
│   ├── PlayerList               # Current players with active indicator
│   ├── WheelSpinner             # 7-segment SVG wheel (Framer Motion)
│   ├── MissionCard              # Mission text + Complete/Fail buttons
│   ├── ChaosEventDisplay        # Gold chaos card overlay
│   └── Leaderboard              # Sorted by shots (compact)
└── ResultsPage
    ├── TitleCard[]              # MVP, Most Drank, Most Fearless, etc.
    └── FinalLeaderboard         # Full stats per player
```

### State Management

#### Zustand — `gameStore.ts`

```typescript
interface GameState {
  roomCode: string;
  status: RoomStatus;              // 'waiting' | 'playing' | 'finished'
  players: Player[];
  currentPlayerIndex: number;
  round: number;
  totalRounds: number;
  currentMission: Mission | null;
  currentChaos: ChaosEvent | null;
  usedMissionIds: string[];        // Prevent repeats within 5-round window
  timeRemainingSeconds: number;
  turnOrder: string[];             // Player IDs
  isReversed: boolean;             // Reversed by chaos event
}
```

#### Zustand — `playerStore.ts` (persisted to localStorage)

```typescript
interface PlayerStore {
  name: string;
  playerId: string;                // crypto.randomUUID(), stable across page loads
}
```

### Game Logic (`lib/gameLogic.ts`)

| Function | Purpose |
|----------|---------|
| `getNextPlayerIndex(state)` | Calculate next player (handles reverse order) |
| `selectMission(category, usedIds)` | Pick random mission, avoiding recent 35 |
| `shouldTriggerChaos()` | 10% probability check |
| `calculateRounds(minutes, players)` | ~30s per turn formula |
| `getPlayerTitle(player, all)` | Determine end-game award |
| `WHEEL_CATEGORIES` | 7 categories in wheel order |

### i18n

- **Namespaces**: `common` (UI strings), `game` (gameplay strings)
- **Languages**: `en`, `he`
- **RTL**: `useDirection()` hook sets `document.documentElement.dir` on language change
- **Mission text**: Stored as `{ en: string; he: string }` in data files, rendered by current language

---

## Part E — Data Files

### Missions (`data/missions.ts`) — 80 total

| Category | Count | Target | Has Duration |
|----------|-------|--------|-------------|
| solo | 15 | solo | Some |
| duo | 12 | duo | No |
| group | 12 | group | No |
| truth | 12 | solo | No |
| skill | 10 | solo | Yes |
| speed | 10 | solo | Yes (all) |
| secret | 9 | mixed | No |

### Chaos Events (`data/chaosEvents.ts`) — 8 events

| Effect | Description |
|--------|-------------|
| `double_spin` | Spin again after this turn |
| `reverse_order` | Flip turn direction |
| `everyone_drinks` | All players take a sip |
| `safe_round` | No penalty this turn |
| `triple_penalty` | Next fail = 3 shots |

### Titles (`data/titles.ts`) — 5 awards

| Title | Emoji | Criteria |
|-------|-------|----------|
| MVP | 🏆 | Most challenges completed |
| Most Drank | 💀 | Most shots taken |
| Most Fearless | 🔥 | Most challenges failed |
| Iron Liver | 🫀 | Longest fail streak (≥3) |
| Saint | 😇 | Zero shots + completed challenges |

---

## Part F — Visual Theme

### Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-dark` | `#0A0A0A` | Background start |
| `bg-purple` | `#1A0B2E` | Background end |
| `neon-pink` | `#FF10F0` | Primary accent, CTA buttons |
| `neon-blue` | `#00D4FF` | Secondary accent, info |
| `neon-green` | `#39FF14` | Success states |
| `neon-red` | `#FF3131` | Fail states, danger |
| `neon-gold` | `#FFD700` | Chaos events, awards |
| `glass` | `rgba(255,255,255,0.05)` | Card backgrounds |
| `glass-border` | `rgba(255,255,255,0.1)` | Card borders |

### CSS Utilities

| Class | Effect |
|-------|--------|
| `.glass` | Glassmorphism card (bg + border + blur) |
| `.glow-pink/blue/green/red/gold` | Box shadow glow |
| `.text-glow-pink/blue` | Text shadow glow |

---

## Part G — Deployment & Native

### Web (Vercel)

- `npm run build` → `dist/` → Vercel auto-deploy from `main`
- SPA fallback: all routes → `index.html`

### Native (Capacitor — Phase 5)

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: "app.spinshot.game",
  appName: "SpinShot",
  webDir: "dist",
};
```

- **Routing**: `MemoryRouter` for native, `BrowserRouter` for web (detected via `isNativePlatform()`)
- **Safe areas**: Capacitor StatusBar + SafeArea plugins
- **Haptics**: Capacitor Haptics plugin on spin, complete, fail events

---

*Last updated: March 4, 2026*
