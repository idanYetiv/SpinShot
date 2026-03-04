import { useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { WheelSpinner } from "../components/game/WheelSpinner";
import { MissionCard } from "../components/game/MissionCard";
import { Leaderboard } from "../components/game/Leaderboard";
import { Timer } from "../components/game/Timer";
import { PlayerList } from "../components/game/PlayerList";
import { ChaosEventDisplay } from "../components/game/ChaosEvent";
import { Badge } from "../components/ui/Badge";
import { usePlayerStore } from "../store/playerStore";
import { selectMission, shouldTriggerChaos } from "../lib/gameLogic";
import { chaosEvents } from "../data/chaosEvents";
import type { Mission, MissionCategory, ChaosEvent, Player, Language } from "../lib/types";

export function GamePage() {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation("game");
  const playerName = usePlayerStore((s) => s.name);
  const playerId = usePlayerStore((s) => s.playerId);

  const language = (searchParams.get("lang") ?? "en") as Language;
  const gameLength = Number(searchParams.get("length") ?? 20);

  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [currentChaos, setCurrentChaos] = useState<ChaosEvent | null>(null);
  const [usedMissionIds, setUsedMissionIds] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [players, setPlayers] = useState<Player[]>([
    {
      id: playerId,
      room_id: code ?? "",
      name: playerName || "Player 1",
      shots: 0,
      challenges_completed: 0,
      challenges_failed: 0,
      fail_streak: 0,
      is_host: true,
      joined_at: new Date().toISOString(),
    },
  ]);

  const currentPlayer = players[0]!;

  const handleSpinResult = useCallback((category: MissionCategory) => {
    // Check for chaos event
    if (shouldTriggerChaos()) {
      const randomChaos = chaosEvents[Math.floor(Math.random() * chaosEvents.length)]!;
      setCurrentChaos(randomChaos);
      setTimeout(() => setCurrentChaos(null), 3000);
    }

    const mission = selectMission(category, usedMissionIds);
    if (mission) {
      setCurrentMission(mission);
      setUsedMissionIds((prev) => [...prev, mission.id]);
    }
  }, [usedMissionIds]);

  const handleComplete = useCallback(() => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === currentPlayer.id
          ? { ...p, challenges_completed: p.challenges_completed + 1, fail_streak: 0 }
          : p,
      ),
    );
    setCurrentMission(null);
    setRound((r) => r + 1);
  }, [currentPlayer.id]);

  const handleFail = useCallback(() => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === currentPlayer.id
          ? {
              ...p,
              shots: p.shots + 1,
              challenges_failed: p.challenges_failed + 1,
              fail_streak: p.fail_streak + 1,
            }
          : p,
      ),
    );
    setCurrentMission(null);
    setRound((r) => r + 1);
  }, [currentPlayer.id]);

  const totalRounds = useMemo(() => Math.floor((gameLength * 60) / 30), [gameLength]);

  return (
    <div className="flex min-h-dvh flex-col p-4 gap-4">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-lg font-bold text-neon-pink">
            {t("yourTurn")}
          </h2>
          <Badge variant="blue">
            {t("round", { current: round, total: totalRounds })}
          </Badge>
        </div>
        <Timer seconds={gameLength * 60} />
      </motion.div>

      {/* Players */}
      <PlayerList players={players} currentPlayerId={currentPlayer.id} />

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        {/* Chaos Event overlay */}
        <ChaosEventDisplay event={currentChaos} language={language} />

        {/* Mission Card or Spinner */}
        {currentMission ? (
          <MissionCard
            mission={currentMission}
            language={language}
            onComplete={handleComplete}
            onFail={handleFail}
          />
        ) : (
          <WheelSpinner onResult={handleSpinResult} />
        )}
      </div>

      {/* Bottom Leaderboard */}
      <Leaderboard players={players} compact />
    </div>
  );
}
