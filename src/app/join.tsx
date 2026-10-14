import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Screen } from "../components/ui/Screen";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { Title } from "../components/ui/Title";
import { usePlayerStore } from "../store/playerStore";
import { isValidRoomCode, normalizeRoomCode } from "../lib/roomCode";
import { colors } from "../theme";

// Online join lands in Phase 2 (Supabase Realtime). Until then this screen
// collects the details and explains pass-and-play.
const ONLINE_JOIN_ENABLED: boolean = false;

export default function JoinGameScreen() {
  const { t } = useTranslation();
  const { name: savedName, setName } = usePlayerStore();
  const [name, setLocalName] = useState(savedName);
  const [code, setCode] = useState("");

  const canJoin = ONLINE_JOIN_ENABLED && !!name.trim() && isValidRoomCode(code);

  return (
    <Screen scroll center>
      <Title color={colors.blue}>{t("join.title")}</Title>
      <Card>
        <Field label={t("join.name")} placeholder={t("join.namePlaceholder")} value={name} onChangeText={setLocalName} maxLength={20} />
        <Field
          label={t("join.code")}
          placeholder={t("join.codePlaceholder")}
          value={code}
          onChangeText={(v) => setCode(normalizeRoomCode(v))}
          maxLength={6}
          autoCapitalize="characters"
          autoCorrect={false}
          big
        />
        <Button
          title={t("join.joinRoom")}
          size="lg"
          variant="secondary"
          disabled={!canJoin}
          onPress={() => {
            setName(name.trim());
            router.replace(`/lobby/${normalizeRoomCode(code)}`);
          }}
        />
        <Text style={styles.note}>{t("join.comingSoon")}</Text>
      </Card>
      <Button title={t("common.back")} variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, textAlign: "center" },
});
