# SpinShot — System Design

> Technical reference for the SpinShot party game architecture (Expo app).

---

## Part A — High-Level Overview

### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                 Expo app (iOS / Android / web)                │
│                                                               │
│  Expo Router screens: / · /create · /join · /lobby/[code]     │
│                       /game/[code] · /results/[code]          │
│                          │                                    │
│  ┌───────────────────────┴─────────────────────────────────┐ │
│  │                    Zustand stores                        │ │
│  │  gameStore (game engine)  ·  playerStore (AsyncStorage)  │ │
│  └───────────────────────┬─────────────────────────────────┘ │
│                          │                                    │
│  ┌───────────────────────┴─────────────────────────────────┐ │
│  │        Supabase client (Phase 2): Realtime channel       │ │
│  └───────────────────────┬─────────────────────────────────┘ │
└──────────────────────────┼───────────────────────────────────┘
                           ▼
              ┌────────────────────────┐
              │  Supabase              │
              │  Postgres: rooms,      │
              │  players, game_results │
              │  Realtime: Presence +  │
              │  Broadcast             │
              └────────────────────────┘
```

### Play modes

- **Pass-and-play (today)**: one phone runs `gameStore`; the host adds players in the lobby and the phone is passed around.
- **Online (Phase 2)**: every player on their own phone. The host's `gameStore` is the source of truth and is broadcast over a Supabase Realtime channel; the other phones render it and send actions (complete / penalty) back.

### Multiplayer model (Phase 2)

```
Host phone                            Player phones
┌──────────────────┐                ┌──────────────────┐
│  gameStore        │   Broadcast    │  Render only      │
│  - turn rotation  │ ─────────────► │  - mirror state    │
│  - mission select │   (channel)    │  - send actions    │
│  - chaos effects  │                │    on their turn   │
│  - scoring/timer  │ ◄───────────── │                    │
└──────────────────┘   User action   └──────────────────┘
```

If the host disconnects, the first remaining player by join order becomes host (Presence) and continues from the last broadcast state.

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| App | Expo SDK 57, React Native 0.86, TypeScript strict | iOS, Android, web |
| Routing | Expo Router | File-based routes in `src/app` |
| Styling | StyleSheet + `src/theme` tokens | Neon theme, `boxShadow` glows |
| State | Zustand 5 | Game engine + persisted player identity |
| Animation | Reanimated 4, expo-haptics | Wheel, card entrances, feedback |
| Graphics | react-native-svg, expo-linear-gradient | Wheel, background |
| i18n | i18next + react-i18next | Hebrew/English + RTL |
| Backend | Supabase (Phase 2) | Postgres + Realtime + Presence + anonymous auth |
| Build | EAS Build / Submit / Update | Store builds, OTA updates |

---

## Part B — Database Schema (Phase 2)

```sql
CREATE TABLE rooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text UNIQUE NOT NULL,            -- 6-char room code
  host_id     uuid NOT NULL,                   -- auth.uid() of host (anonymous auth)
  language    text NOT NULL DEFAULT 'en',      -- 'en' | 'he'
  game_length int  NOT NULL DEFAULT 20,        -- minutes (20 or 30)
  status      text NOT NULL DEFAULT 'waiting', -- 'waiting' | 'playing' | 'finished'
  created_at  timestamptz DEFAULT now(),
  started_at  timestamptz,
  finished_at timestamptz,
  settings    jsonb DEFAULT '{"chaos_enabled": true}'::jsonb
);

CREATE TABLE players (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id              uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id              uuid NOT NULL,          -- auth.uid()
  name                 text NOT NULL,
  penalties            int DEFAULT 0,
  challenges_completed int DEFAULT 0,
  challenges_failed    int DEFAULT 0,
  fail_streak          int DEFAULT 0,
  best_fail_streak     int DEFAULT 0,
  is_host              boolean DEFAULT false,
  joined_at            timestamptz DEFAULT now(),
  UNIQUE(room_id, name)
);

CREATE TABLE game_results (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     uuid REFERENCES rooms(id) ON DELETE CASCADE,
  results     jsonb NOT NULL,   -- { players: Player[], titles: Award[] }
  finished_at timestamptz DEFAULT now()
);
```

### Security

Use Supabase **anonymous sign-in** so every phone has an `auth.uid()`. RLS: anyone signed in can read a room by code and insert themselves as a player; only the host (`host_id = auth.uid()`) can update the room or other players' scores. Do not ship the open `USING (true)` policies from the original draft.

---

## Part C — Realtime Architecture (Phase 2)

One channel per room: `room:{CODE}` with Presence keyed by player id.

| Event | Direction | Payload |
|-------|-----------|---------|
| `state` | Host → All | Full `gameStore` snapshot (small; send after every action) |
| `action` | Player → Host | `{ type: 'complete' \| 'penalty', playerId }` |
| `start` / `end` | Host → All | — |

Sending the full snapshot instead of fine-grained events keeps late joiners and host failover simple.

---

## Part D — App Architecture

### Routes

| Route | Screen |
|-------|--------|
| `/` | Welcome: logo, Create/Join/How to play, one-time 17+ disclaimer, language toggle |
| `/create` | Name, language, game length → creates room in `gameStore` |
| `/join` | Name + code (enabled in Phase 2) |
| `/lobby/[code]` | Room code (tap to copy), players, add pass-and-play players, Start |
| `/game/[code]` | Turn header + timer, chaos banner, wheel ↔ mission card, outcome line, leaderboard |
| `/results/[code]` | Titles, final leaderboard, Play again (same group) |

### Game engine (`store/gameStore.ts`)

State: `status`, `players`, `currentIndex`, `turnsTaken`, `totalRounds`, `endsAt`, `phase` (`spin`/`mission`), `currentMission`, `currentChaos`, `usedMissionIds`, `reversed`, per-turn modifiers (`safeTurn`, `penaltyMultiplier`, `extraSpin`), `lastOutcome`.

| Action | Effect |
|--------|--------|
| `spin(category)` | Picks a mission (avoids the last 35), 10% chaos roll and applies its effect |
| `completeMission()` | +1 completed, resets fail streak, next turn |
| `failMission()` | + penalties (×3 if triple, 0 if safe turn), streak tracking, next turn |
| next turn | Double spin keeps the same player; otherwise advance (respecting reverse). Ends when all rounds are played or time runs out |

Rounds: `floor(minutes × 60 / 30s / players)`; every player gets one turn per round.

### Chaos events (`data/chaosEvents.ts`)

| Effect | Behaviour |
|--------|-----------|
| `double_spin` | Same player spins again after this turn |
| `reverse_order` | Flips turn direction |
| `everyone_penalty` | +1 penalty for every player |
| `safe_round` | Failing this turn costs nothing |
| `triple_penalty` | Failing this turn = 3 penalties |

### Titles (`data/titles.ts`) — a title is awarded only to a single leader (ties win nothing)

| Title | Criteria |
|-------|----------|
| 🏆 MVP | Most challenges completed |
| 💀 Penalty Magnet | Most penalties |
| 🔥 Most Fearless | Most challenges failed |
| 🦾 Unbreakable | Longest fail streak (≥ 3) |
| 😇 Untouchable | Only player with zero penalties and ≥ 1 completed |

### i18n / RTL

Namespaces `common` and `game`; mission/chaos/title text is `{ en, he }` in data files. RTL uses the Yoga `direction` style on screen roots (native) and `document.dir` on web, so switching language needs no reload.

---

## Part E — Content

80 missions in 7 categories (solo 15, duo 12, group 12, truth 12, skill 10, speed 10, secret 9). Wording is party-game neutral: "take the penalty", never "drink". The group agrees on its house penalty before playing.

---

## Part F — Build & Release

- Dev: `npx expo start` + Expo Go (all current modules are in Expo Go).
- Store builds: EAS (`eas init`, `eas build`, `eas submit`), bundle id `com.isyappstudio.spinshot`, Expo/Supabase projects under the `isyappstudio` org.
- Age rating target: 17+ (party content, user-defined penalties). Store copy should describe a party game.

---

*Last updated: October 14, 2026*
