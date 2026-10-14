import { StyleSheet, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import type { Language, Mission } from "../../lib/types";
import { colors, space } from "../../theme";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CATEGORY_COLORS } from "./categoryColors";

interface MissionCardProps {
  mission: Mission;
  language: Language;
  playerName: string;
  onComplete: () => void;
  onFail: () => void;
}

export function MissionCard({ mission, language, playerName, onComplete, onFail }: MissionCardProps) {
  const { t } = useTranslation("game");
  const color = CATEGORY_COLORS[mission.category];
  return (
    <Animated.View entering={ZoomIn.springify().damping(14)} key={mission.id} style={styles.wrap}>
      <Card glowColor={color} style={styles.card}>
        <View style={styles.header}>
          <Badge label={t(`categories.${mission.category}`)} color={color} />
          {mission.duration ? <Text style={styles.duration}>⏱ {t("seconds", { count: mission.duration })}</Text> : null}
        </View>
        <Text style={styles.player}>{playerName}</Text>
        <Text style={styles.text}>{mission.text[language]}</Text>
        <View style={styles.actions}>
          <Button title={t("complete")} variant="success" onPress={onComplete} style={styles.flex} />
          <Button title={t("fail")} variant="danger" onPress={onFail} style={styles.flex} />
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  card: { padding: space.xl, gap: space.lg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  duration: { color: colors.textSecondary, fontSize: 14, fontWeight: "600" },
  player: { color: colors.textSecondary, fontSize: 15, fontWeight: "700", textAlign: "center" },
  text: { color: colors.text, fontSize: 22, fontWeight: "800", lineHeight: 30, textAlign: "center" },
  actions: { flexDirection: "row", gap: space.md, marginTop: space.sm },
  flex: { flex: 1 },
});
