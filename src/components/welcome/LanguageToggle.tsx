import { Pressable, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, radius } from "../../theme";
import { usePlayerStore } from "../../store/playerStore";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const setLanguage = usePlayerStore((s) => s.setLanguage);
  const next = i18n.language === "en" ? "he" : "en";
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        setLanguage(next);
        void i18n.changeLanguage(next);
      }}
      style={styles.btn}
    >
      <Text style={styles.text}>{next === "he" ? "עברית" : "English"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { borderWidth: 1, borderColor: colors.glassBorder, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 6 },
  text: { color: colors.textSecondary, fontSize: 14, fontWeight: "600" },
});
