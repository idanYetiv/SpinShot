# SpinShot — Claude Session Guide

> **Read this file at the start of each session.** Also read `AGENTS.md` (Expo rules).

---

## 1. Session Setup (REQUIRED)

```bash
cd ~/Personal/SpinShot
git config user.name "idanYetiv"
git config user.email "idanyativ@gmail.com"
```

---

## CRITICAL GIT RULE — NO EXCEPTIONS

**NEVER push directly to `main`. ALWAYS use a PR.**

**Required workflow:**
```bash
git checkout -b feat/descriptive-name
# ... make changes ...
git add <files>
git commit -m "feat: description"
git push -u origin feat/descriptive-name
gh pr create --title "..." --body "..."
# STOP — Share PR link and WAIT for user approval
gh pr merge <number> --squash --delete-branch  # Only after user approves
git checkout main && git pull
```

**NEVER merge a PR without explicit user approval.**

---

## 2. Project Overview

**SpinShot** — a real-time multiplayer **party game**. Players join a room via code, spin a challenge wheel, and either complete the challenge or take the group's **penalty**. Ages 17+.

**Tagline:** Spin it. Do it. Or pay the penalty.

### Content rule (App Store)
The app is a *party game*, not a drinking game. In-app text never tells players to drink.
Missions/chaos/titles say "take the penalty"; the group picks its own house penalty
(push-ups, a silly dance, a sip — their call). The only alcohol mention is the
responsible-play note in the disclaimer. Keep it that way when adding content.

---

## 3. Tech Stack

| Layer | Technology |
|-------|------------|
| App | Expo SDK 57 + React Native 0.86 + TypeScript (strict) |
| Routing | Expo Router (file-based, `src/app/`) |
| Styling | `StyleSheet` + tokens in `src/theme` (neon theme, `boxShadow` glows) |
| State | Zustand 5 (`gameStore` = game engine, `playerStore` persisted via AsyncStorage) |
| Animation | Reanimated 4 (wheel, entering animations), expo-haptics |
| Graphics | react-native-svg (wheel), expo-linear-gradient (background) |
| i18n | i18next + react-i18next (Hebrew/English, RTL via `direction` style) |
| Backend | Supabase (Phase 2 — DB + Realtime Channels + Presence) |
| Build/Deploy | EAS Build / Submit / Update |

Bundle id: `com.isyappstudio.spinshot` (iOS + Android).

---

## 4. Project Structure

```
SpinShot/
├── CLAUDE.md / AGENTS.md / README.md / SYSTEM-DESIGN.md / SPINSHOT_Game_Spec.md
├── app.json / package.json / tsconfig.json
├── assets/images/            # icon, splash, adaptive icons (placeholders — replace)
└── src/
    ├── app/                  # Expo Router screens
    │   ├── _layout.tsx       # Stack, i18n init, language restore
    │   ├── index.tsx         # Welcome (+ disclaimer, how to play)
    │   ├── create.tsx / join.tsx
    │   ├── lobby/[code].tsx  # room code, players (pass-and-play add)
    │   ├── game/[code].tsx   # wheel, mission card, chaos, leaderboard, timer
    │   └── results/[code].tsx
    ├── components/           # ui/, welcome/, lobby/, game/, results/
    ├── hooks/useDirection.ts # RTL helpers (native style / web document dir)
    ├── store/                # gameStore.ts (engine), playerStore.ts (persisted)
    ├── lib/                  # types, gameLogic, roomCode, utils, haptics
    ├── data/                 # missions (80), chaosEvents (8), titles (5)
    ├── i18n/                 # i18next config + en/he locales
    └── theme/                # colors, glow helpers, spacing
```

---

## 5. Quick Commands

```bash
npm install
npx expo start            # dev server — scan QR with Expo Go
npx expo start --web      # web preview
npm run typecheck         # tsc --noEmit
npx expo install <pkg>    # ALWAYS use this to add packages
npx expo-doctor           # dependency/config check
```

Everything used today runs in **Expo Go** (no custom native modules yet).

---

## 6. Key Patterns

- **Game engine in `gameStore`**: turn rotation, mission selection, chaos effects, scoring, end conditions. Screens only call actions (`spin`, `completeMission`, `failMission`, `endGame`).
- **Host authority (Phase 2)**: the host phone runs `gameStore` and broadcasts state over Supabase Realtime; other phones render it. Today it runs locally as **pass-and-play** (host adds players in the lobby).
- **Wheel**: the landing segment is picked first, then the wheel animates so that segment stops under the pointer.
- **RTL**: `useDirectionStyle()` on screen roots (Yoga `direction`), `document.dir` on web. No `I18nManager.forceRTL` (avoids app reload).
- **Room codes**: 6 chars, no ambiguous characters (0/O/1/I/L).
- **No auth in MVP**: Phase 2 should use Supabase anonymous sign-in, not open RLS.

---

## 7. Implementation Phases

- **Phase 1** ✅ — UI, 80 missions, i18n (Vite)
- **Phase 1.5** ✅ — Migrated to Expo; party-game wording; local game engine + pass-and-play
- **Phase 2** — Supabase + real-time multiplayer (rooms, Presence, broadcast host state)
- **Phase 3** — Polish: sounds, QR join, custom house penalty, more missions
- **Phase 4** — EAS builds, TestFlight, store listing

---

## 8. Visual Theme

- Background: `#0A0A0A` → `#1A0B2E` gradient
- Primary: Neon Pink `#FF10F0` · Secondary: Electric Blue `#00D4FF`
- Success: Neon Green `#39FF14` · Fail: Fire Red `#FF3131` · Gold `#FFD700` (chaos, awards)
- Dark mode only, glow effects (`glow()` in `src/theme`), glass cards

---

*Last updated: October 14, 2026*
