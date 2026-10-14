import { StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from "react-native";
import { colors, radius } from "../../theme";

interface FieldProps extends TextInputProps {
  label?: string;
  big?: boolean;
  containerStyle?: ViewStyle;
}

export function Field({ label, big, style, containerStyle, ...props }: FieldProps) {
  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.pink}
        style={[styles.input, big && styles.big, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { color: colors.textSecondary, fontSize: 14, fontWeight: "600", textAlign: "left" },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
    width: "100%",
    minWidth: 0,
  },
  big: { textAlign: "center", fontSize: 26, fontWeight: "900", letterSpacing: 6 },
});
