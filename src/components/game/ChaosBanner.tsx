import { StyleSheet, Text } from "react-native";
import Animated, { BounceIn } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import type { ChaosEvent, Language } from "../../lib/types";
import { colors, glow, hexToRgba, radius, space, textGlow } from "../../theme";

export function ChaosBanner({ event, language }: { event: ChaosEvent; language: Language }) {
  const { t } = useTranslation("game");
  return (
    <Animated.View entering={BounceIn} style={styles.banner}>
      <Text style={[styles.title, textGlow(colors.gold)]}>⚡ {t("chaosEvent")} ⚡</Text>
      <Text style={styles.text}>{event.text[language]}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: hexToRgba(colors.gold, 0.1),
    padding: space.lg,
    gap: 6,
    boxShadow: glow(colors.gold, 0.4),
  },
  title: { color: colors.gold, fontSize: 18, fontWeight: "900", textAlign: "center" },
  text: { color: colors.text, fontSize: 16, fontWeight: "700", textAlign: "center" },
});
