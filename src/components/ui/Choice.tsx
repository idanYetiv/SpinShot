import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, hexToRgba, radius } from "../../theme";
import { haptic } from "../../lib/haptics";

interface ChoiceProps<T extends string | number> {
  label?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  color?: string;
}

/** Segmented choice row (language, game length…). */
export function Choice<T extends string | number>({ label, options, value, onChange, color = colors.pink }: ChoiceProps<T>) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Pressable
              key={String(o.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => {
                haptic.tap();
                onChange(o.value);
              }}
              style={[
                styles.option,
                active && { borderColor: color, backgroundColor: hexToRgba(color, 0.12) },
              ]}
            >
              <Text style={[styles.optionText, active && { color }]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { color: colors.textSecondary, fontSize: 14, fontWeight: "600", textAlign: "left" },
  row: { flexDirection: "row", gap: 10 },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  optionText: { color: colors.textSecondary, fontSize: 15, fontWeight: "600" },
});
