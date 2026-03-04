import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FinalLeaderboard } from "../components/results/FinalLeaderboard";
import { TitleCard } from "../components/results/TitleCard";
import { Button } from "../components/ui/Button";
import { playerTitles } from "../data/titles";
import type { Player, Language } from "../lib/types";

// Static demo data for Phase 1
const DEMO_PLAYERS: Player[] = [
  { id: "1", room_id: "demo", name: "Idan", shots: 5, challenges_completed: 8, challenges_failed: 5, fail_streak: 2, is_host: true, joined_at: "" },
  { id: "2", room_id: "demo", name: "Maya", shots: 3, challenges_completed: 10, challenges_failed: 3, fail_streak: 1, is_host: false, joined_at: "" },
  { id: "3", room_id: "demo", name: "Noam", shots: 7, challenges_completed: 5, challenges_failed: 7, fail_streak: 4, is_host: false, joined_at: "" },
];

export function ResultsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const language: Language = "en";

  const awards = useMemo(() => {
    return playerTitles
      .map((title) => {
        const winner = title.criteria(DEMO_PLAYERS);
        return winner ? { title, player: winner } : null;
      })
      .filter((a): a is NonNullable<typeof a> => a !== null);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <motion.div
        className="w-full max-w-md flex flex-col gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h1 className="text-4xl font-black text-center text-glow-pink">
          {t("results.title")}
        </h1>

        {/* Titles */}
        <div className="flex flex-col gap-4">
          {awards.map((award, i) => (
            <TitleCard
              key={award.title.id}
              title={award.title}
              player={award.player}
              language={language}
              index={i}
            />
          ))}
        </div>

        {/* Final Leaderboard */}
        <div>
          <h2 className="text-xl font-bold mb-3 text-glow-blue">
            {t("results.finalLeaderboard")}
          </h2>
          <FinalLeaderboard players={DEMO_PLAYERS} />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" glow onClick={() => navigate("/create")} className="w-full">
            {t("results.playAgain")}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
            {t("results.backHome")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
