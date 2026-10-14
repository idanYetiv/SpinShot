# SpinShot

> Spin it. Do it. Or pay the penalty.

Party game for groups of friends. Spin the wheel, get a challenge, complete it or take your group's house penalty. Hebrew + English.

## Features

- 7 challenge categories: Solo, Duo, Group, Truth, Skill, Speed, Secret
- 80 bilingual missions (English + Hebrew, full RTL)
- Animated wheel with haptics
- Chaos events (10% per spin): double spin, reverse order, group penalty, safe turn, triple penalty
- Live leaderboard, timer, end-game titles (MVP, Penalty Magnet, Most Fearless, Unbreakable, Untouchable)
- Pass-and-play on one phone (online rooms coming in Phase 2)
- Neon party theme

## Tech Stack

Expo SDK 57 · React Native · TypeScript · Expo Router · Zustand · Reanimated · react-native-svg · i18next · Supabase (Phase 2) · EAS

## Getting Started

```bash
npm install
npx expo start        # scan the QR code with Expo Go
```

Other commands: `npx expo start --web`, `npm run typecheck`, `npx expo-doctor`.

## Project Status

- [x] Phase 1: UI + content (Vite)
- [x] Phase 1.5: Expo migration, party-game wording, local game loop
- [ ] Phase 2: Supabase + real-time multiplayer
- [ ] Phase 3: Polish (sounds, QR join, custom penalty)
- [ ] Phase 4: EAS builds + store release

## License

MIT
