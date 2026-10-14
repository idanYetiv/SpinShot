import type { Player, PlayerTitle } from "../lib/types";

function topBy(players: Player[], key: (p: Player) => number, min = 1): Player | null {
  if (players.length === 0) return null;
  const max = Math.max(...players.map(key));
  const leaders = players.filter((p) => key(p) === max);
  // Ties don't win a title.
  return max >= min && leaders.length === 1 ? leaders[0]! : null;
}

export const playerTitles: PlayerTitle[] = [
  {
    id: "mvp",
    emoji: "🏆",
    text: { en: "MVP", he: "שחקן מצטיין" },
    description: { en: "Most challenges completed", he: "הכי הרבה אתגרים שהושלמו" },
    criteria: (ps) => topBy(ps, (p) => p.challenges_completed),
  },
  {
    id: "penalty_magnet",
    emoji: "💀",
    text: { en: "Penalty Magnet", he: "מגנט לעונשים" },
    description: { en: "Took the most penalties", he: "חטף הכי הרבה עונשים" },
    criteria: (ps) => topBy(ps, (p) => p.penalties),
  },
  {
    id: "most_fearless",
    emoji: "🔥",
    text: { en: "Most Fearless", he: "הכי אמיץ" },
    description: { en: "Failed the most but kept going", he: "נכשל הכי הרבה אבל המשיך" },
    criteria: (ps) => topBy(ps, (p) => p.challenges_failed),
  },
  {
    id: "unbreakable",
    emoji: "🦾",
    text: { en: "Unbreakable", he: "בלתי שביר" },
    description: { en: "Survived the longest fail streak", he: "שרד את רצף הכישלונות הכי ארוך" },
    criteria: (ps) => topBy(ps, (p) => p.best_fail_streak, 3),
  },
  {
    id: "untouchable",
    emoji: "😇",
    text: { en: "Untouchable", he: "בלתי ניתן לנגיעה" },
    description: { en: "Didn't take a single penalty", he: "לא חטף אף עונש" },
    criteria: (ps) => {
      const clean = ps.filter((p) => p.penalties === 0 && p.challenges_completed > 0);
      return clean.length === 1 ? clean[0]! : null;
    },
  },
];
