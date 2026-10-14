import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import type { Language } from "../lib/types";

interface PlayerStore {
  name: string;
  playerId: string;
  language: Language;
  disclaimerAccepted: boolean;
  setName: (name: string) => void;
  setLanguage: (language: Language) => void;
  acceptDisclaimer: () => void;
}

/** The local device's player identity + preferences (persisted). */
export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      name: "",
      playerId: Crypto.randomUUID(),
      language: "en",
      disclaimerAccepted: false,
      setName: (name) => set({ name }),
      setLanguage: (language) => set({ language }),
      acceptDisclaimer: () => set({ disclaimerAccepted: true }),
    }),
    {
      name: "spinshot-player",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
