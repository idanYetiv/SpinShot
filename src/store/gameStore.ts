import { create } from "zustand";
import type { GameState, Mission, ChaosEvent, Player } from "../lib/types";

interface GameStore extends GameState {
  setPlayers: (players: Player[]) => void;
  setCurrentPlayerIndex: (index: number) => void;
  setRound: (round: number) => void;
  setMission: (mission: Mission | null) => void;
  setChaos: (chaos: ChaosEvent | null) => void;
  addUsedMission: (id: string) => void;
  setTimeRemaining: (seconds: number) => void;
  setReversed: (reversed: boolean) => void;
  updatePlayer: (id: string, update: Partial<Player>) => void;
  reset: () => void;
}

const initialState: GameState = {
  roomCode: "",
  status: "waiting",
  players: [],
  currentPlayerIndex: 0,
  round: 1,
  totalRounds: 10,
  currentMission: null,
  currentChaos: null,
  usedMissionIds: [],
  timeRemainingSeconds: 0,
  turnOrder: [],
  isReversed: false,
};

export const useGameStore = create<GameStore>()((set) => ({
  ...initialState,
  setPlayers: (players) =>
    set({ players, turnOrder: players.map((p) => p.id) }),
  setCurrentPlayerIndex: (currentPlayerIndex) => set({ currentPlayerIndex }),
  setRound: (round) => set({ round }),
  setMission: (currentMission) => set({ currentMission }),
  setChaos: (currentChaos) => set({ currentChaos }),
  addUsedMission: (id) =>
    set((s) => ({ usedMissionIds: [...s.usedMissionIds, id] })),
  setTimeRemaining: (timeRemainingSeconds) => set({ timeRemainingSeconds }),
  setReversed: (isReversed) => set({ isReversed }),
  updatePlayer: (id, update) =>
    set((s) => ({
      players: s.players.map((p) => (p.id === id ? { ...p, ...update } : p)),
    })),
  reset: () => set(initialState),
}));
