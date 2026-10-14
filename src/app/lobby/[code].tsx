import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { Screen } from "../../components/ui/Screen";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Title } from "../../components/ui/Title";
import { RoomCode } from "../../components/lobby/RoomCode";
import { useGameStore } from "../../store/gameStore";
import { colors, space } from "../../theme";
import { getInitials } from "../../lib/utils";

export default function LobbyScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { t } = useTranslation();
  const { roomCode, status, players, gameLength, addLocalPlayer, removePlayer, startGame } = useGameStore();
  const [newName, setNewName] = useState("");

  if (status === "idle" || roomCode !== code) return <Redirect href="/" />;

  function add() {
    addLocalPlayer(newName);
    setNewName("");
  }

  function start() {
    startGame();
    router.replace(`/game/${roomCode}`);
  }

  return (
    <Screen scroll>
      <Title color={colors.blue}>{t("lobby.title")}</Title>
      <RoomCode code={roomCode} />
      <View style={styles.badges}>
        <Badge label={t("create.minutes", { count: gameLength })} color={colors.blue} />
      </View>

      <Card>
        <Text style={styles.section}>{t("lobby.players", { count: players.length })}</Text>
        {players.map((p) => (
          <Animated.View key={p.id} entering={FadeInDown} exiting={FadeOut} style={styles.player}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(p.name)}</Text>
            </View>
            <Text style={styles.playerName} numberOfLines={1}>{p.name}</Text>
            {p.is_host ? (
              <Badge label={t("lobby.host")} color={colors.gold} />
            ) : (
              <Pressable accessibilityRole="button" accessibilityLabel={t("lobby.remove")} onPress={() => removePlayer(p.id)} hitSlop={10}>
                <Text style={styles.remove}>✕</Text>
              </Pressable>
            )}
          </Animated.View>
        ))}
        <View style={styles.addRow}>
          <Field
            placeholder={t("lobby.addPlaceholder")}
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={add}
            maxLength={20}
            returnKeyType="done"
            submitBehavior="submit"
            containerStyle={styles.addField}
          />
          <Button title={t("lobby.add")} variant="secondary" onPress={add} disabled={!newName.trim()} />
        </View>
        <Text style={styles.hint}>{t("lobby.addPlayer")}</Text>
      </Card>

      <Button
        title={players.length < 2 ? t("lobby.minPlayers") : t("lobby.startGame")}
        size="lg"
        onPress={start}
        disabled={players.length < 2}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  badges: { flexDirection: "row", justifyContent: "center", gap: space.sm },
  section: { color: colors.text, fontSize: 18, fontWeight: "800", textAlign: "left" },
  player: { flexDirection: "row", alignItems: "center", gap: space.md },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.pink, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.text, fontWeight: "900" },
  playerName: { flex: 1, color: colors.text, fontSize: 17, fontWeight: "700", textAlign: "left" },
  remove: { color: colors.textSecondary, fontSize: 18, paddingHorizontal: 6 },
  addRow: { flexDirection: "row", gap: space.sm, alignItems: "flex-end", marginTop: space.sm },
  addField: { flex: 1, minWidth: 0 },
  hint: { color: colors.textSecondary, fontSize: 12, textAlign: "left" },
});
