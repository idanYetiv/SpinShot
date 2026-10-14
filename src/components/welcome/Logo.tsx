import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { colors, textGlow } from "../../theme";

export function Logo() {
  const { t } = useTranslation();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [pulse]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={styles.wrap}>
      {/* One text run, so the Latin wordmark keeps its order in RTL too */}
      <Animated.View style={style}>
        <Text style={styles.word}>
          <Text style={[{ color: colors.pink }, textGlow(colors.pink)]}>SPIN</Text>
          <Text style={[{ color: colors.blue }, textGlow(colors.blue)]}>SHOT</Text>
        </Text>
      </Animated.View>
      <Text style={styles.tagline}>{t("app.tagline")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 10 },
  word: { writingDirection: "ltr", fontSize: 60, fontWeight: "900", letterSpacing: -1 },
  tagline: { color: colors.textSecondary, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", textAlign: "center" },
});
