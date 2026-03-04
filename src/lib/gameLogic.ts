import type { Player, Mission, GameState, MissionCategory } from "./types";
import { missions } from "../data/missions";

const RECENT_MISSION_BUFFER = 5;

export function getNextPlayerIndex(state: GameState): number {
  const direction = state.isReversed ? -1 : 1;
  const count = state.turnOrder.length;
  return ((state.currentPlayerIndex + direction) % count + count) % count;
}

export function selectMission(
  category: MissionCategory,
  usedIds: string[],
): Mission | undefined {
  const available = missions.filter(
    (m) => m.category === category && !usedIds.slice(-RECENT_MISSION_BUFFER * 7).includes(m.id),
  );
  if (available.length === 0) {
    // All used recently — pick any from category
    const all = missions.filter((m) => m.category === category);
    return all[Math.floor(Math.random() * all.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}

export function shouldTriggerChaos(): boolean {
  return Math.random() < 0.1; // 10%
}

export function calculateRounds(gameLengthMinutes: number, playerCount: number): number {
  // ~30 seconds per turn
  return Math.floor((gameLengthMinutes * 60) / (30 * Math.max(playerCount, 2)));
}

export function getPlayerTitle(
  player: Player,
  allPlayers: Player[],
): string | null {
  const maxShots = Math.max(...allPlayers.map((p) => p.shots));
  const maxCompleted = Math.max(...allPlayers.map((p) => p.challenges_completed));
  const maxFailed = Math.max(...allPlayers.map((p) => p.challenges_failed));

  if (player.challenges_completed === maxCompleted && maxCompleted > 0) return "mvp";
  if (player.shots === maxShots && maxShots > 0) return "most_drank";
  if (player.challenges_failed === maxFailed && maxFailed > 0) return "most_fearless";
  return null;
}

export const WHEEL_CATEGORIES: MissionCategory[] = [
  "solo", "duo", "group", "truth", "skill", "speed", "secret",
];
