import type { Mission, MissionCategory, Player } from "./types";
import { missions } from "../data/missions";
import { pickRandom } from "./utils";

export const WHEEL_CATEGORIES: MissionCategory[] = [
  "solo", "duo", "group", "truth", "skill", "speed", "secret",
];

/** Avoid repeating a mission within roughly the last 5 spins per category. */
const RECENT_BUFFER = 35;
export const CHAOS_PROBABILITY = 0.1;
const SECONDS_PER_TURN = 30;

export function nextIndex(current: number, count: number, reversed: boolean): number {
  if (count === 0) return 0;
  const dir = reversed ? -1 : 1;
  return (((current + dir) % count) + count) % count;
}

export function selectMission(category: MissionCategory, usedIds: string[]): Mission {
  const recent = new Set(usedIds.slice(-RECENT_BUFFER));
  const inCategory = missions.filter((m) => m.category === category);
  const fresh = inCategory.filter((m) => !recent.has(m.id));
  return pickRandom(fresh.length > 0 ? fresh : inCategory);
}

export function shouldTriggerChaos(): boolean {
  return Math.random() < CHAOS_PROBABILITY;
}

/** Total rounds: every player gets a turn per round, ~30s per turn. */
export function calculateRounds(gameLengthMinutes: number, playerCount: number): number {
  const turns = (gameLengthMinutes * 60) / SECONDS_PER_TURN;
  return Math.max(1, Math.floor(turns / Math.max(playerCount, 1)));
}

export function makePlayer(id: string, name: string, isHost: boolean): Player {
  return {
    id,
    name,
    penalties: 0,
    challenges_completed: 0,
    challenges_failed: 0,
    fail_streak: 0,
    best_fail_streak: 0,
    is_host: isHost,
    joined_at: new Date().toISOString(),
  };
}

export function sortByScore(players: Player[]): Player[] {
  return [...players].sort(
    (a, b) => b.challenges_completed - a.challenges_completed || a.penalties - b.penalties,
  );
}
