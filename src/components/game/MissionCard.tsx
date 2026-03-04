import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Mission, Language } from "../../lib/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface MissionCardProps {
  mission: Mission | null;
  language: Language;
  onComplete: () => void;
  onFail: () => void;
}

const categoryBadgeVariant = {
  solo: "pink" as const,
  duo: "blue" as const,
  group: "green" as const,
  truth: "gold" as const,
  skill: "red" as const,
  speed: "red" as const,
  secret: "gold" as const,
};

export function MissionCard({ mission, language, onComplete, onFail }: MissionCardProps) {
  const { t } = useTranslation("game");

  return (
    <AnimatePresence mode="wait">
      {mission && (
        <motion.div
          key={mission.id}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          className="glass glow-pink rounded-2xl p-6 text-center"
        >
          <Badge variant={categoryBadgeVariant[mission.category]} className="mb-3">
            {t(`categories.${mission.category}`)}
          </Badge>

          <p className="text-xl font-bold mb-6 leading-relaxed">
            {mission.text[language]}
          </p>

          {mission.duration && (
            <p className="text-text-secondary text-sm mb-4">
              ⏱ {mission.duration}s
            </p>
          )}

          <div className="flex gap-3">
            <Button variant="primary" glow onClick={onComplete} className="flex-1">
              {t("complete")}
            </Button>
            <Button variant="danger" glow onClick={onFail} className="flex-1">
              {t("fail")}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
