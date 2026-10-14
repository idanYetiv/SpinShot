import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Player } from "../../lib/types";
import { sortByScore } from "../../lib/gameLogic";
import { colors, hexToRgba, radius, space } from "../../theme";

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard({ players, currentId }: { players: Player[]; currentId?: string }) {
  const { t } = useTranslation("game");
  return (
    <View style={styles.list}>
      <View style={styles.headRow}>
        <Text style={[styles.head, styles.name]}>{t("leaderboard")}</Text>
        <Text style={styles.head}>✅</Text>
        <Text style={styles.head}>💀</Text>
      </View>
      {sortByScore(players).map((p, i) => (
        <View key={p.id} style={[styles.row, p.id === currentId && styles.current]}>
          <Text style={styles.rank}>{MEDALS[i] ?? `${i + 1}`}</Text>
          <Text style={[styles.cell, styles.name]} numberOfLines={1}>{p.name}</Text>
          <Text style={[styles.cell, styles.num, { color: colors.green }]}>{p.challenges_completed}</Text>
          <Text style={[styles.cell, styles.num, { color: colors.red }]}>{p.penalties}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 6 },
  headRow: { flexDirection: "row", paddingHorizontal: space.md, gap: space.sm },
  head: { color: colors.textSecondary, fontSize: 12, fontWeight: "700", width: 32, textAlign: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: 8,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    backgroundColor: colors.glass,
  },
  current: { backgroundColor: hexToRgba(colors.pink, 0.12), borderWidth: 1, borderColor: hexToRgba(colors.pink, 0.4) },
  rank: { width: 24, textAlign: "center", fontSize: 15, color: colors.textSecondary },
  cell: { color: colors.text, fontSize: 15, fontWeight: "700" },
  name: { flex: 1, textAlign: "left", width: undefined },
  num: { width: 32, textAlign: "center" },
});
