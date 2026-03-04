import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { usePlayerStore } from "../store/playerStore";
import { generateRoomCode } from "../lib/roomCode";
import type { Language } from "../lib/types";

export function CreateGamePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setName = usePlayerStore((s) => s.setName);

  const [playerName, setPlayerName] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [gameLength, setGameLength] = useState(20);

  function handleCreate() {
    if (!playerName.trim()) return;
    setName(playerName.trim());
    const code = generateRoomCode();
    // In Phase 2 this will create a room in Supabase
    navigate(`/lobby/${code}?host=true&lang=${language}&length=${gameLength}`);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-center mb-6 text-glow-pink">
          {t("create.title")}
        </h1>

        <Card className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              {t("create.name")}
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t("create.namePlaceholder")}
              maxLength={20}
              className="w-full rounded-xl bg-white/5 border border-glass-border px-4 py-3 text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-neon-pink transition-colors"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              {t("create.language")}
            </label>
            <div className="flex gap-3">
              {(["en", "he"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                    language === lang
                      ? "border-neon-pink bg-neon-pink/10 text-neon-pink"
                      : "border-glass-border bg-white/5 text-text-secondary hover:border-neon-pink/50"
                  }`}
                >
                  {t(`language.${lang}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Game Length */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              {t("create.gameLength")}
            </label>
            <div className="flex gap-3">
              {[20, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setGameLength(mins)}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                    gameLength === mins
                      ? "border-neon-blue bg-neon-blue/10 text-neon-blue"
                      : "border-glass-border bg-white/5 text-text-secondary hover:border-neon-blue/50"
                  }`}
                >
                  {t("create.minutes", { count: mins })}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            glow
            onClick={handleCreate}
            disabled={!playerName.trim()}
            className="w-full mt-2"
          >
            {t("create.createRoom")}
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
