import { StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { Title } from "../ui/Title";
import { usePlayerStore } from "../../store/playerStore";

/** One-time age + play-respectfully gate. */
export function Disclaimer() {
  const { t } = useTranslation();
  const accepted = usePlayerStore((s) => s.disclaimerAccepted);
  const accept = usePlayerStore((s) => s.acceptDisclaimer);
  const hydrated = usePlayerStore.persist.hasHydrated();

  return (
    <Sheet visible={hydrated && !accepted}>
      <Text style={styles.emoji}>🎉</Text>
      <Title size={24}>{t("disclaimer.title")}</Title>
      <Text style={styles.body}>{t("disclaimer.message")}</Text>
      <Button title={t("disclaimer.confirm")} onPress={accept} size="lg" />
      <Text style={styles.note}>{t("disclaimer.note")}</Text>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: 48, textAlign: "center" },
  body: { color: colors.text, fontSize: 16, lineHeight: 24, textAlign: "center" },
  note: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, textAlign: "center" },
});
