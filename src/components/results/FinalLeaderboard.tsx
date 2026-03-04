import { motion } from "framer-motion";
import type { Player } from "../../lib/types";
import { Card } from "../ui/Card";

interface FinalLeaderboardProps {
  players: Player[];
}

const MEDALS = ["🥇", "🥈", "🥉"];

export function FinalLeaderboard({ players }: FinalLeaderboardProps) {
  const sorted = [...players].sort((a, b) => b.shots - a.shots);

  return (
    <Card glow="blue">
      <div className="flex flex-col gap-3">
        {sorted.map((player, i) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-8 text-center">
                {MEDALS[i] ?? `${i + 1}.`}
              </span>
              <span className="font-bold text-lg">{player.name}</span>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-neon-pink font-bold">{player.shots} 🥃</span>
              <span className="text-neon-green">{player.challenges_completed} ✅</span>
              <span className="text-neon-red">{player.challenges_failed} ❌</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
