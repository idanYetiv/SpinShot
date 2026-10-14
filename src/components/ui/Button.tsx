import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from "react-native";
import { colors, glow, hexToRgba, radius } from "../../theme";
import { haptic } from "../../lib/haptics";

type Variant = "primary" | "secondary" | "success" | "danger" | "ghost";
type Size = "md" | "lg";

const variantColor: Record<Exclude<Variant, "ghost">, string> = {
  primary: colors.pink,
  secondary: colors.blue,
  success: colors.green,
  danger: colors.red,
};

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = "primary", size = "md", disabled, loading, style }: ButtonProps) {
  const color = variant === "ghost" ? null : variantColor[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled || loading}
      onPress={() => {
        haptic.tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        size === "lg" ? styles.lg : styles.md,
        color
          ? { backgroundColor: color, boxShadow: disabled ? undefined : glow(color) }
          : styles.ghost,
        pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text
          style={[
            styles.label,
            size === "lg" && styles.labelLg,
            { color: color && color !== colors.pink && color !== colors.red ? colors.bgDark : colors.text },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.md, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  md: { minHeight: 48 },
  lg: { minHeight: 58 },
  ghost: { borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: hexToRgba("#FFFFFF", 0.04) },
  disabled: { opacity: 0.4 },
  label: { fontSize: 16, fontWeight: "700" },
  labelLg: { fontSize: 18, fontWeight: "800" },
});
