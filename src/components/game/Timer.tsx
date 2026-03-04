import { useTranslation } from "react-i18next";
import { formatTime } from "../../lib/utils";

interface TimerProps {
  seconds: number;
}

export function Timer({ seconds }: TimerProps) {
  const { t } = useTranslation("game");
  const isLow = seconds < 60;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-secondary">{t("timeLeft")}:</span>
      <span className={`font-mono text-lg font-bold ${isLow ? "text-neon-red" : "text-neon-green"}`}>
        {formatTime(seconds)}
      </span>
    </div>
  );
}
