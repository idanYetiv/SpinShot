import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, space } from "../../theme";
import { useDirectionStyle } from "../../hooks/useDirection";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  center?: boolean;
  style?: ViewStyle;
}

/** Full-screen neon gradient background with safe-area padding and RTL direction. */
export function Screen({ children, scroll, center, style }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const directionStyle = useDirectionStyle();
  const padding = {
    paddingTop: insets.top + space.lg,
    paddingBottom: insets.bottom + space.lg,
    paddingHorizontal: space.lg,
  };
  const content = [styles.content, center && styles.center, padding, style];

  return (
    <LinearGradient
      colors={[colors.bgDark, colors.bgPurple]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.fill, directionStyle]}
    >
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.grow, ...content]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, ...content]}>{children}</View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  grow: { flexGrow: 1 },
  content: { width: "100%", maxWidth: 480, alignSelf: "center", gap: space.lg },
  center: { justifyContent: "center" },
});
