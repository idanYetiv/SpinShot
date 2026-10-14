import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Screen } from "../../components/ui/Screen";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Title } from "../../components/ui/Title";
import { TitleCard } from "../../components/results/TitleCard";
import { Leaderboard } from "../../components/game/Leaderboard";
import { useGameStore } from "../../store/gameStore";
import { playerTitles } from "../../data/titles";
import type { Language } from "../../lib/types";
import { colors, space } from "../../theme";

export default function ResultsScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { t, i18n } = useTranslation();
  const language: Language = i18n.language === "he" ? "he" : "en";
  const { roomCode, status, players, gameLength, createRoom, reset } = useGameStore();

  const awards = useMemo(
    () =>
      playerTitles
        .map((title) => ({ title, player: title.criteria(players) }))
        .filter((a): a is { title: typeof a.title; player: NonNullable<typeof a.player> } => a.player !== null),
    [players],
  );

  if (roomCode !== code || status !== "finished") return <Redirect href="/" />;

  function playAgain() {
    // Same group, fresh scores.
    const [host, ...rest] = players;
    if (!host) return;
    createRoom({ code: roomCode, host: { id: host.id, name: host.name }, gameLength });
    rest.forEach((p) => useGameStore.getState().addLocalPlayer(p.name));
    router.replace(`/lobby/${roomCode}`);
  }

  return (
    <Screen scroll>
      <Title size={36}>{t("results.title")}</Title>
      <View style={{ gap: space.md }}>
        {awards.map((a, i) => (
          <TitleCard key={a.title.id} title={a.title} player={a.player} language={language} index={i} />
        ))}
      </View>
      <Card>
        <Text style={styles.section}>{t("results.finalLeaderboard")}</Text>
        <Leaderboard players={players} />
      </Card>
      <Button title={t("results.playAgain")} size="lg" onPress={playAgain} />
      <Button
        title={t("results.backHome")}
        variant="ghost"
        onPress={() => {
          reset();
          router.replace("/");
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { color: colors.blue, fontSize: 18, fontWeight: "800", textAlign: "left" },
});
