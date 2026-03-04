import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Player } from "../../lib/types";
import { getInitials } from "../../lib/utils";
import { Card } from "../ui/Card";

interface PlayerJoinListProps {
  players: Player[];
}

export function PlayerJoinList({ players }: PlayerJoinListProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <h3 className="text-lg font-bold mb-3">
        {t("lobby.players")} ({players.length})
      </h3>
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {players.map((player) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-blue/20 text-sm font-bold text-neon-blue">
                {getInitials(player.name)}
              </div>
              <span className="font-medium flex-1">{player.name}</span>
              {player.is_host && (
                <span className="text-sm text-neon-gold">👑 Host</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
