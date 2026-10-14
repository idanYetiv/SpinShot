import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useTranslation } from "react-i18next";
import { colors, space, textGlow } from "../../theme";
import { Card } from "../ui/Card";

export function RoomCode({ code }: { code: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={async () => {
        await Clipboard.setStringAsync(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      <Card glowColor={colors.blue} style={styles.card}>
        <Text style={styles.label}>{t("lobby.roomCode")}</Text>
        <Text style={[styles.code, textGlow(colors.blue)]}>{code}</Text>
        <Text style={styles.hint}>{copied ? t("lobby.copied") : t("lobby.shareCode")}</Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", gap: space.xs },
  label: { color: colors.textSecondary, fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  code: { color: colors.blue, fontSize: 40, fontWeight: "900", letterSpacing: 8 },
  hint: { color: colors.textSecondary, fontSize: 13 },
});
