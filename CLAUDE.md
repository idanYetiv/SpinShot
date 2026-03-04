# SpinShot — Claude Session Guide

> **Read this file at the start of each session.**

---

## 1. Session Setup (REQUIRED)

```bash
cd ~/projects/SpinShot
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

**SpinShot** — A real-time multiplayer party drinking game. Players join a room via code, spin a task wheel, complete challenges or drink. Built for ages 18+.

**Tagline:** Spin it. Do it. Or drink it.

---

## 3. Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 19 + TypeScript (strict) |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| State | Zustand 5 (client) |
| Routing | React Router 7 |
| Animation | Framer Motion |
| i18n | i18next (Hebrew/English + RTL) |
| Backend | Supabase (DB + Realtime Channels + Presence) |
| Native | Capacitor 8 (iOS + Android) |
| Deploy | Vercel |

---

## 4. Project Structure

```
~/projects/SpinShot/
├── CLAUDE.md / README.md / SPINSHOT_Game_Spec.md
├── package.json / vite.config.ts / tsconfig*.json
├── index.html
└── src/
    ├── main.tsx / App.tsx / index.css
    ├── pages/          # 6 route pages
    ├── components/     # ui/, welcome/, lobby/, game/, results/
    ├── hooks/          # useDirection, (future: useRoom, useRoomChannel, etc.)
    ├── store/          # gameStore.ts, playerStore.ts (Zustand)
    ├── lib/            # types, utils, roomCode, gameLogic, platform, supabase
    ├── data/           # missions (80), chaosEvents, titles
    └── i18n/           # i18next config + en/he locales
```

---

## 5. Quick Commands

```bash
npm run dev          # Dev server with HMR
npm run build        # Production build (tsc + vite build)
npm run preview      # Preview production build
```

---

## 6. Key Patterns

- **Neon party theme**: Dark bg (#0A0A0A → #1A0B2E), neon pink/blue/green accents, glow effects, glassmorphism
- **i18n**: Hebrew + English with RTL support via `useDirection` hook
- **Host authority**: Host client runs game logic, broadcasts state via Supabase Realtime; others listen
- **No auth in MVP**: Public rooms, no user accounts
- **Room codes**: 6-character alphanumeric (no ambiguous chars like 0/O/1/I/L)
- **State**: Zustand for game state, playerStore persisted to localStorage

---

## 7. Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | WelcomePage | Logo, Create/Join/How to Play, age disclaimer |
| `/create` | CreateGamePage | Name, language, game length |
| `/join` | JoinGamePage | Name, room code |
| `/lobby/:code` | LobbyPage | Player list, room code, host starts |
| `/game/:code` | GamePage | Spinner, missions, leaderboard |
| `/results/:code` | ResultsPage | Final leaderboard, titles |

---

## 8. Implementation Phases

- **Phase 1** ✅ — Project setup + static UI (all pages, components, 80 missions, i18n)
- **Phase 2** — Supabase + real-time multiplayer (DB, Realtime channels, room CRUD)
- **Phase 3** — Core game loop (turn rotation, mission flow, chaos events, timer)
- **Phase 4** — End game + polish (results, sounds, haptics, QR codes)
- **Phase 5** — Capacitor + deploy (iOS/Android, Vercel, CI)

---

## 9. Visual Theme

- Background: `#0A0A0A` → `#1A0B2E` gradient
- Primary: Neon Pink `#FF10F0`
- Secondary: Electric Blue `#00D4FF`
- Success: Neon Green `#39FF14`
- Fail: Fire Red `#FF3131`
- Gold: `#FFD700` (special events)
- Dark mode only, glow effects, glassmorphism cards

---

*Last updated: March 2, 2026*
