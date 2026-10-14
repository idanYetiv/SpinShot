import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { hexToRgba, radius } from "../../theme";

export function Badge({ label, color, style }: { label: string; color: string; style?: ViewStyle }) {
  return (
    <View style={[styles.badge, { backgroundColor: hexToRgba(color, 0.15), borderColor: hexToRgba(color, 0.5) }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  text: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
});
