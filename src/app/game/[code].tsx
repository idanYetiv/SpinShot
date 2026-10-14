import { useCallback, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, { FadeIn } from "react-native-reanimated";
import { Screen } from "../../components/ui/Screen";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Wheel } from "../../components/game/Wheel";
import { MissionCard } from "../../components/game/MissionCard";
import { ChaosBanner } from "../../components/game/ChaosBanner";
import { Leaderboard } from "../../components/game/Leaderboard";
import { Timer } from "../../components/game/Timer";
import { currentRound, useGameStore, type TurnOutcome } from "../../store/gameStore";
import { haptic } from "../../lib/haptics";
import type { Language, Player } from "../../lib/types";
import { colors, space, textGlow } from "../../theme";

export default function GameScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { t, i18n } = useTranslation("game");
  const language: Language = i18n.language === "he" ? "he" : "en";
  const game = useGameStore();
  const { status, players, currentIndex, phase, currentMission, currentChaos, endsAt, lastOutcome } = game;

  useEffect(() => {
    if (status === "finished") router.replace(`/results/${game.roomCode}`);
  }, [status, game.roomCode]);

  const endGame = useGameStore((s) => s.endGame);
  const onTimeUp = useCallback(() => endGame(), [endGame]);

  if (game.roomCode !== code || (status !== "playing" && status !== "finished")) return <Redirect href="/" />;

  const current = players[currentIndex]!;
  const round = Math.min(currentRound(game), game.totalRounds);

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={{ gap: 6 }}>
          <Text style={[styles.turn, textGlow(colors.pink)]} numberOfLines={1}>
            {t("turnOf", { name: current.name })}
          </Text>
          <Badge label={t("round", { current: round, total: game.totalRounds })} color={colors.blue} style={{ alignSelf: "flex-start" }} />
        </View>
        {endsAt ? <Timer endsAt={endsAt} onEnd={onTimeUp} /> : null}
      </View>

      {currentChaos ? <ChaosBanner event={currentChaos} language={language} /> : null}

      <View style={styles.stage}>
        {phase === "mission" && currentMission ? (
          <MissionCard
            mission={currentMission}
            language={language}
            playerName={current.name}
            onComplete={() => {
              haptic.success();
              game.completeMission();
            }}
            onFail={() => {
              haptic.fail();
              game.failMission();
            }}
          />
        ) : (
          <>
            {lastOutcome ? (
              <OutcomeBanner outcome={lastOutcome} players={players} next={current} />
            ) : null}
            <Wheel onResult={(c) => game.spin(c)} />
          </>
        )}
      </View>

      <Card>
        <Leaderboard players={players} currentId={current.id} />
      </Card>
      <Button title={t("endGame")} variant="ghost" onPress={endGame} />
    </Screen>
  );
}

function OutcomeBanner({ outcome, players, next }: { outcome: TurnOutcome; players: Player[]; next: Player }) {
  const { t } = useTranslation("game");
  const who = players.find((p) => p.id === outcome.playerId)?.name ?? "";
  const line =
    outcome.kind === "penalty"
      ? `${who}: ${t("penaltyCount", { count: outcome.count })}`
      : outcome.kind === "safe"
        ? `${who}: ${t("safe")}`
        : `${who} ✅`;
  const color = outcome.kind === "penalty" ? colors.red : colors.green;
  return (
    <Animated.View entering={FadeIn} key={JSON.stringify(outcome)} style={styles.outcome}>
      <Text style={[styles.outcomeLine, { color }]}>{line}</Text>
      <Text style={styles.pass}>
        {outcome.playerId === next.id ? t("doubleSpin") : `📱 ${t("passPhone", { name: next.name })}`}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: space.md },
  turn: { color: colors.text, fontSize: 22, fontWeight: "900", textAlign: "left", flexShrink: 1 },
  stage: { alignItems: "center", gap: space.xl, paddingVertical: space.md, minHeight: 380, justifyContent: "center" },
  outcome: { alignItems: "center", gap: 4 },
  outcomeLine: { fontSize: 18, fontWeight: "900", textAlign: "center" },
  pass: { color: colors.textSecondary, fontSize: 15, fontWeight: "600", textAlign: "center" },
});
