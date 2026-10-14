import { create } from "zustand";
import * as Crypto from "expo-crypto";
import type { ChaosEvent, Mission, MissionCategory, Player } from "../lib/types";
import {
  calculateRounds,
  makePlayer,
  nextIndex,
  selectMission,
  shouldTriggerChaos,
} from "../lib/gameLogic";
import { chaosEvents } from "../data/chaosEvents";
import { pickRandom } from "../lib/utils";

export type TurnPhase = "spin" | "mission";

export type TurnOutcome =
  | { kind: "done"; playerId: string }
  | { kind: "penalty"; playerId: string; count: number }
  | { kind: "safe"; playerId: string };

/**
 * Authoritative game state. Today it runs locally (pass-and-play on one phone).
 * In Phase 2 the host's copy of this store is broadcast over Supabase Realtime
 * and other phones render it read-only.
 */
interface GameState {
  roomCode: string;
  status: "idle" | "waiting" | "playing" | "finished";
  gameLength: number; // minutes
  chaosEnabled: boolean;
  players: Player[];
  currentIndex: number;
  turnsTaken: number;
  totalRounds: number;
  endsAt: number | null; // epoch ms
  phase: TurnPhase;
  currentCategory: MissionCategory | null;
  currentMission: Mission | null;
  currentChaos: ChaosEvent | null;
  usedMissionIds: string[];
  reversed: boolean;
  // per-turn modifiers set by chaos events
  safeTurn: boolean;
  penaltyMultiplier: number;
  extraSpin: boolean;
  lastOutcome: TurnOutcome | null;
}

interface GameActions {
  createRoom: (args: { code: string; host: { id: string; name: string }; gameLength: number }) => void;
  addLocalPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  spin: (category: MissionCategory) => void;
  completeMission: () => void;
  failMission: () => void;
  dismissChaos: () => void;
  endGame: () => void;
  reset: () => void;
}

const initial: GameState = {
  roomCode: "",
  status: "idle",
  gameLength: 20,
  chaosEnabled: true,
  players: [],
  currentIndex: 0,
  turnsTaken: 0,
  totalRounds: 1,
  endsAt: null,
  phase: "spin",
  currentCategory: null,
  currentMission: null,
  currentChaos: null,
  usedMissionIds: [],
  reversed: false,
  safeTurn: false,
  penaltyMultiplier: 1,
  extraSpin: false,
  lastOutcome: null,
};

export const currentRound = (s: Pick<GameState, "turnsTaken" | "players">) =>
  Math.floor(s.turnsTaken / Math.max(s.players.length, 1)) + 1;

export const useGameStore = create<GameState & GameActions>()((set, get) => {
  /** Move to the next turn (or end the game). */
  function finishTurn(players: Player[], outcome: TurnOutcome) {
    const s = get();
    const base = {
      players,
      lastOutcome: outcome,
      phase: "spin" as const,
      currentMission: null,
      currentCategory: null,
      currentChaos: null,
      safeTurn: false,
      penaltyMultiplier: 1,
    };

    if (s.extraSpin) {
      set({ ...base, extraSpin: false });
      return;
    }

    const turnsTaken = s.turnsTaken + 1;
    const roundsDone = Math.floor(turnsTaken / players.length);
    const timeUp = s.endsAt !== null && Date.now() >= s.endsAt;
    if (roundsDone >= s.totalRounds || timeUp) {
      set({ ...base, turnsTaken, status: "finished", endsAt: null });
      return;
    }
    set({
      ...base,
      turnsTaken,
      currentIndex: nextIndex(s.currentIndex, players.length, s.reversed),
    });
  }

  function updateCurrent(fn: (p: Player) => Player): Player[] {
    const s = get();
    return s.players.map((p, i) => (i === s.currentIndex ? fn(p) : p));
  }

  return {
    ...initial,

    createRoom: ({ code, host, gameLength }) =>
      set({
        ...initial,
        roomCode: code,
        status: "waiting",
        gameLength,
        players: [makePlayer(host.id, host.name, true)],
      }),

    addLocalPlayer: (name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const taken = get().players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase());
      if (taken) return;
      set((s) => ({ players: [...s.players, makePlayer(Crypto.randomUUID(), trimmed, false)] }));
    },

    removePlayer: (id) =>
      set((s) => ({ players: s.players.filter((p) => p.id !== id || p.is_host) })),

    startGame: () => {
      const s = get();
      if (s.players.length < 2) return;
      set({
        status: "playing",
        currentIndex: 0,
        turnsTaken: 0,
        totalRounds: calculateRounds(s.gameLength, s.players.length),
        endsAt: Date.now() + s.gameLength * 60_000,
        phase: "spin",
        usedMissionIds: [],
        reversed: false,
        lastOutcome: null,
      });
    },

    spin: (category) => {
      const s = get();
      const mission = selectMission(category, s.usedMissionIds);
      const patch: Partial<GameState> = {
        phase: "mission",
        currentCategory: category,
        currentMission: mission,
        usedMissionIds: [...s.usedMissionIds, mission.id],
        lastOutcome: null,
        currentChaos: null,
      };

      if (s.chaosEnabled && shouldTriggerChaos()) {
        const chaos = pickRandom(chaosEvents);
        patch.currentChaos = chaos;
        switch (chaos.effect) {
          case "reverse_order":
            patch.reversed = !s.reversed;
            break;
          case "everyone_penalty":
            patch.players = s.players.map((p) => ({ ...p, penalties: p.penalties + 1 }));
            break;
          case "safe_round":
            patch.safeTurn = true;
            break;
          case "triple_penalty":
            patch.penaltyMultiplier = 3;
            break;
          case "double_spin":
            patch.extraSpin = true;
            break;
        }
      }
      set(patch);
    },

    completeMission: () => {
      const id = get().players[get().currentIndex]!.id;
      const players = updateCurrent((p) => ({
        ...p,
        challenges_completed: p.challenges_completed + 1,
        fail_streak: 0,
      }));
      finishTurn(players, { kind: "done", playerId: id });
    },

    failMission: () => {
      const s = get();
      const id = s.players[s.currentIndex]!.id;
      const count = s.safeTurn ? 0 : s.penaltyMultiplier;
      const players = updateCurrent((p) => {
        const streak = p.fail_streak + 1;
        return {
          ...p,
          penalties: p.penalties + count,
          challenges_failed: p.challenges_failed + 1,
          fail_streak: streak,
          best_fail_streak: Math.max(p.best_fail_streak, streak),
        };
      });
      finishTurn(
        players,
        count === 0 ? { kind: "safe", playerId: id } : { kind: "penalty", playerId: id, count },
      );
    },

    dismissChaos: () => set({ currentChaos: null }),

    endGame: () => set({ status: "finished", endsAt: null, phase: "spin", currentMission: null }),

    reset: () => set(initial),
  };
});
