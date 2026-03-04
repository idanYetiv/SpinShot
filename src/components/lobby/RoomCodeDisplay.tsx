import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui/Card";

interface RoomCodeDisplayProps {
  code: string;
}

export function RoomCodeDisplay({ code }: RoomCodeDisplayProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card glow="pink" className="text-center">
      <p className="text-sm text-text-secondary mb-2">{t("lobby.roomCode")}</p>
      <button
        onClick={copyCode}
        className="text-4xl font-black tracking-[0.3em] text-neon-pink cursor-pointer hover:brightness-110 transition-all"
      >
        {code}
      </button>
      <p className="text-xs text-text-secondary mt-2">
        {copied ? "Copied!" : t("lobby.shareCode")}
      </p>
    </Card>
  );
}
