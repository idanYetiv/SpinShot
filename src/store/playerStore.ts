import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerStore {
  name: string;
  playerId: string;
  setName: (name: string) => void;
  setPlayerId: (id: string) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      name: "",
      playerId: crypto.randomUUID(),
      setName: (name) => set({ name }),
      setPlayerId: (id) => set({ playerId: id }),
      reset: () => set({ name: "", playerId: crypto.randomUUID() }),
    }),
    { name: "spinshot-player" },
  ),
);
