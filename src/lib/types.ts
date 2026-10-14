export type Language = "en" | "he";
export type RoomStatus = "waiting" | "playing" | "finished";
export type MissionCategory = "solo" | "duo" | "group" | "truth" | "skill" | "speed" | "secret";
export type LocalizedText = { en: string; he: string };

export interface RoomSettings {
  chaos_enabled: boolean;
}

/** Supabase row (Phase 2). */
export interface Room {
  id: string;
  code: string;
  host_id: string;
  language: Language;
  game_length: number; // minutes
  status: RoomStatus;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  settings: RoomSettings;
}

export interface Player {
  id: string;
  name: string;
  penalties: number;
  challenges_completed: number;
  challenges_failed: number;
  fail_streak: number;
  best_fail_streak: number;
  is_host: boolean;
  joined_at: string;
}

export interface Mission {
  id: string;
  category: MissionCategory;
  text: LocalizedText;
  duration?: number; // seconds, for timed missions
  target?: "solo" | "duo" | "group";
}

export type ChaosEffect =
  | "double_spin"
  | "reverse_order"
  | "everyone_penalty"
  | "safe_round"
  | "triple_penalty";

export interface ChaosEvent {
  id: string;
  text: LocalizedText;
  effect: ChaosEffect;
}

export interface PlayerTitle {
  id: string;
  emoji: string;
  text: LocalizedText;
  description: LocalizedText;
  criteria: (players: Player[]) => Player | null;
}
