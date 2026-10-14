import { StyleSheet, Text, type TextStyle } from "react-native";
import { colors, textGlow } from "../../theme";

export function Title({ children, color = colors.pink, size = 30, style }: { children: string; color?: string; size?: number; style?: TextStyle }) {
  return <Text style={[styles.title, { fontSize: size }, textGlow(color), style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontWeight: "900", textAlign: "center" },
});
