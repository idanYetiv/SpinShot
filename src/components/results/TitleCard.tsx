import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { Language, Player, PlayerTitle } from "../../lib/types";
import { colors, space } from "../../theme";
import { Card } from "../ui/Card";

export function TitleCard({ title, player, language, index }: { title: PlayerTitle; player: Player; language: Language; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 150)}>
      <Card glowColor={colors.gold} style={styles.card}>
        <Text style={styles.emoji}>{title.emoji}</Text>
        <View style={styles.body}>
          <Text style={styles.title}>{title.text[language]}</Text>
          <Text style={styles.player}>{player.name}</Text>
          <Text style={styles.desc}>{title.description[language]}</Text>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: space.lg },
  emoji: { fontSize: 40 },
  body: { flex: 1, gap: 2 },
  title: { color: colors.gold, fontSize: 13, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase", textAlign: "left" },
  player: { color: colors.text, fontSize: 20, fontWeight: "900", textAlign: "left" },
  desc: { color: colors.textSecondary, fontSize: 13, textAlign: "left" },
});
