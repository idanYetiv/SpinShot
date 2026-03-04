export type Language = "en" | "he";
export type RoomStatus = "waiting" | "playing" | "finished";
export type MissionCategory = "solo" | "duo" | "group" | "truth" | "skill" | "speed" | "secret";

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

export interface RoomSettings {
  chaos_enabled: boolean;
}

export interface Player {
  id: string;
  room_id: string;
  name: string;
  shots: number;
  challenges_completed: number;
  challenges_failed: number;
  fail_streak: number;
  is_host: boolean;
  joined_at: string;
}

export interface Mission {
  id: string;
  category: MissionCategory;
  text: { en: string; he: string };
  duration?: number; // seconds, for timed missions
  target?: "solo" | "duo" | "group";
}

export interface ChaosEvent {
  id: string;
  text: { en: string; he: string };
  effect: ChaosEffect;
}

export type ChaosEffect =
  | "double_spin"
  | "reverse_order"
  | "everyone_drinks"
  | "safe_round"
  | "triple_penalty";

export interface GameState {
  roomCode: string;
  status: RoomStatus;
  players: Player[];
  currentPlayerIndex: number;
  round: number;
  totalRounds: number;
  currentMission: Mission | null;
  currentChaos: ChaosEvent | null;
  usedMissionIds: string[];
  timeRemainingSeconds: number;
  turnOrder: string[]; // player IDs
  isReversed: boolean;
}

export interface PlayerTitle {
  id: string;
  key: string;
  emoji: string;
  text: { en: string; he: string };
  description: { en: string; he: string };
  criteria: (players: Player[]) => Player | null;
}

// Broadcast event types
export type GameEvent =
  | { type: "game_start"; state: GameState }
  | { type: "spin_result"; category: MissionCategory }
  | { type: "mission_assigned"; mission: Mission; playerId: string }
  | { type: "mission_complete"; playerId: string }
  | { type: "mission_fail"; playerId: string; shots: number }
  | { type: "turn_change"; playerIndex: number }
  | { type: "chaos_event"; event: ChaosEvent }
  | { type: "game_end" };
