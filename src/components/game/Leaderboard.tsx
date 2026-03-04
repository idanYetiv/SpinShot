import { useTranslation } from "react-i18next";
import type { Player } from "../../lib/types";
import { Card } from "../ui/Card";

interface LeaderboardProps {
  players: Player[];
  compact?: boolean;
}

export function Leaderboard({ players, compact }: LeaderboardProps) {
  const { t } = useTranslation("game");
  const sorted = [...players].sort((a, b) => b.shots - a.shots);

  return (
    <Card>
      <h3 className="text-lg font-bold mb-3 text-glow-blue">
        {t("leaderboard")}
      </h3>
      <div className="flex flex-col gap-2">
        {sorted.map((player, i) => (
          <div
            key={player.id}
            className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-secondary w-5">
                {i + 1}.
              </span>
              <span className="font-medium">{player.name}</span>
            </div>
            {!compact && (
              <div className="flex gap-4 text-sm text-text-secondary">
                <span>{t("shots")}: {player.shots}</span>
                <span>{t("completed")}: {player.challenges_completed}</span>
              </div>
            )}
            {compact && (
              <span className="text-sm font-bold text-neon-pink">
                {player.shots} 🥃
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
