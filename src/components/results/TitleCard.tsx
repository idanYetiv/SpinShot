import { motion } from "framer-motion";
import type { PlayerTitle, Player, Language } from "../../lib/types";

interface TitleCardProps {
  title: PlayerTitle;
  player: Player;
  language: Language;
  index: number;
}

export function TitleCard({ title, player, language, index }: TitleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="glass glow-gold rounded-2xl p-5 text-center"
    >
      <div className="text-4xl mb-2">{title.emoji}</div>
      <h3 className="text-lg font-bold text-neon-gold">{title.text[language]}</h3>
      <p className="text-xl font-black mt-1">{player.name}</p>
      <p className="text-sm text-text-secondary mt-1">
        {title.description[language]}
      </p>
    </motion.div>
  );
}
