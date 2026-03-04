import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { usePlayerStore } from "../store/playerStore";
import { isValidRoomCode, normalizeRoomCode } from "../lib/roomCode";

export function JoinGamePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setName = usePlayerStore((s) => s.setName);

  const [playerName, setPlayerName] = useState("");
  const [code, setCode] = useState("");

  function handleJoin() {
    if (!playerName.trim() || !isValidRoomCode(code)) return;
    setName(playerName.trim());
    const normalized = normalizeRoomCode(code);
    // In Phase 2 this will validate the room exists in Supabase
    navigate(`/lobby/${normalized}`);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-center mb-6 text-glow-blue">
          {t("join.title")}
        </h1>

        <Card className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              {t("join.name")}
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t("join.namePlaceholder")}
              maxLength={20}
              className="w-full rounded-xl bg-white/5 border border-glass-border px-4 py-3 text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-neon-blue transition-colors"
            />
          </div>

          {/* Room Code */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              {t("join.code")}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={t("join.codePlaceholder")}
              maxLength={6}
              className="w-full rounded-xl bg-white/5 border border-glass-border px-4 py-3 text-center text-2xl font-black tracking-[0.2em] text-white placeholder:text-text-secondary/50 placeholder:text-base placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:border-neon-blue transition-colors"
            />
          </div>

          <Button
            variant="secondary"
            size="lg"
            glow
            onClick={handleJoin}
            disabled={!playerName.trim() || !isValidRoomCode(code)}
            className="w-full mt-2"
          >
            {t("join.joinRoom")}
          </Button>
        </Card>

        <button
          onClick={() => navigate("/")}
          className="block mx-auto mt-4 text-sm text-text-secondary hover:text-white transition-colors cursor-pointer"
        >
          ← Back
        </button>
      </motion.div>
    </div>
  );
}
