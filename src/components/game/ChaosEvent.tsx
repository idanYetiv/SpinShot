import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { ChaosEvent as ChaosEventType, Language } from "../../lib/types";

interface ChaosEventProps {
  event: ChaosEventType | null;
  language: Language;
}

export function ChaosEventDisplay({ event, language }: ChaosEventProps) {
  const { t } = useTranslation("game");

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 10 }}
          className="glass glow-gold rounded-2xl p-6 text-center border-2 border-neon-gold/40"
        >
          <motion.div
            className="text-4xl mb-2"
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            ⚡
          </motion.div>
          <h3 className="text-xl font-black text-neon-gold mb-2">
            {t("chaosEvent")}
          </h3>
          <p className="text-lg font-medium">{event.text[language]}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
