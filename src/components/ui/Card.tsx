import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { colors, glow, radius, space } from "../../theme";

export function Card({ children, glowColor, style }: { children: ReactNode; glowColor?: string; style?: ViewStyle }) {
  return (
    <View
      style={[
        styles.card,
        glowColor ? { borderColor: glowColor, boxShadow: glow(glowColor, 0.35) } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
  },
});
