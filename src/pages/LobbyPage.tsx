import { useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { RoomCodeDisplay } from "../components/lobby/RoomCodeDisplay";
import { PlayerJoinList } from "../components/lobby/PlayerJoinList";
import { GameSettings } from "../components/lobby/GameSettings";
import { Button } from "../components/ui/Button";
import { usePlayerStore } from "../store/playerStore";
import type { Player } from "../lib/types";

export function LobbyPage() {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const playerName = usePlayerStore((s) => s.name);
  const playerId = usePlayerStore((s) => s.playerId);

  const isHost = searchParams.get("host") === "true";
  const language = searchParams.get("lang") ?? "en";
  const gameLength = Number(searchParams.get("length") ?? 20);

  // Mock players for static UI — Phase 2 will use Realtime Presence
  const players: Player[] = useMemo(() => [
    {
      id: playerId,
      room_id: code ?? "",
      name: playerName || "You",
      shots: 0,
      challenges_completed: 0,
      challenges_failed: 0,
      fail_streak: 0,
      is_host: isHost,
      joined_at: new Date().toISOString(),
    },
  ], [playerId, code, playerName, isHost]);

  function handleStart() {
    navigate(`/game/${code}?lang=${language}&length=${gameLength}`);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <motion.div
        className="w-full max-w-md flex flex-col gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-center text-glow-blue">
          {t("lobby.title")}
        </h1>

        <RoomCodeDisplay code={code ?? "------"} />
        <GameSettings language={language} gameLength={gameLength} />
        <PlayerJoinList players={players} />

        {isHost ? (
          <Button
            variant="primary"
            size="lg"
            glow
            onClick={handleStart}
            disabled={players.length < 2}
            className="w-full"
          >
            {players.length < 2 ? t("lobby.minPlayers") : t("lobby.startGame")}
          </Button>
        ) : (
          <p className="text-center text-text-secondary animate-pulse">
            {t("lobby.waiting")}
          </p>
        )}
      </motion.div>
    </div>
  );
}
