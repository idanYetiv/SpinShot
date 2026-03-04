import type { Player, PlayerTitle } from "../lib/types";

export const playerTitles: PlayerTitle[] = [
  {
    id: "mvp",
    key: "mvp",
    emoji: "🏆",
    text: { en: "MVP", he: "שחקן מצטיין" },
    description: {
      en: "Most challenges completed",
      he: "הכי הרבה אתגרים שהושלמו",
    },
    criteria: (players: Player[]) => {
      const max = Math.max(...players.map((p) => p.challenges_completed));
      return max > 0 ? players.find((p) => p.challenges_completed === max) ?? null : null;
    },
  },
  {
    id: "most_drank",
    key: "most_drank",
    emoji: "💀",
    text: { en: "Most Drank", he: "הכי שיכור" },
    description: {
      en: "Took the most shots",
      he: "שתה הכי הרבה שוטים",
    },
    criteria: (players: Player[]) => {
      const max = Math.max(...players.map((p) => p.shots));
      return max > 0 ? players.find((p) => p.shots === max) ?? null : null;
    },
  },
  {
    id: "most_fearless",
    key: "most_fearless",
    emoji: "🔥",
    text: { en: "Most Fearless", he: "הכי אמיץ" },
    description: {
      en: "Failed the most but kept going",
      he: "נכשל הכי הרבה אבל המשיך",
    },
    criteria: (players: Player[]) => {
      const max = Math.max(...players.map((p) => p.challenges_failed));
      return max > 0 ? players.find((p) => p.challenges_failed === max) ?? null : null;
    },
  },
  {
    id: "iron_liver",
    key: "iron_liver",
    emoji: "🫀",
    text: { en: "Iron Liver", he: "כבד מברזל" },
    description: {
      en: "Survived the longest fail streak",
      he: "שרד את רצף הכישלונות הכי ארוך",
    },
    criteria: (players: Player[]) => {
      const max = Math.max(...players.map((p) => p.fail_streak));
      return max >= 3 ? players.find((p) => p.fail_streak === max) ?? null : null;
    },
  },
  {
    id: "clean_player",
    key: "clean_player",
    emoji: "😇",
    text: { en: "Saint", he: "קדוש" },
    description: {
      en: "Didn't drink a single shot",
      he: "לא שתה שוט אחד",
    },
    criteria: (players: Player[]) => {
      const sober = players.filter((p) => p.shots === 0 && p.challenges_completed > 0);
      return sober.length === 1 ? sober[0] ?? null : null;
    },
  },
];
