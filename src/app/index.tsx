import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Screen } from "../components/ui/Screen";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/welcome/Logo";
import { LanguageToggle } from "../components/welcome/LanguageToggle";
import { HowToPlay } from "../components/welcome/HowToPlay";
import { Disclaimer } from "../components/welcome/Disclaimer";
import { space } from "../theme";

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const [howTo, setHowTo] = useState(false);

  return (
    <Screen center>
      <View style={styles.topBar}>
        <LanguageToggle />
      </View>
      <View style={styles.body}>
        <Logo />
        <Animated.View entering={FadeInDown.delay(250)} style={styles.actions}>
          <Button title={t("welcome.createGame")} size="lg" onPress={() => router.push("/create")} />
          <Button title={t("welcome.joinGame")} size="lg" variant="secondary" onPress={() => router.push("/join")} />
          <Button title={t("welcome.howToPlay")} variant="ghost" onPress={() => setHowTo(true)} />
        </Animated.View>
      </View>
      <HowToPlay visible={howTo} onClose={() => setHowTo(false)} />
      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", justifyContent: "flex-end" },
  body: { flex: 1, justifyContent: "center", gap: 48 },
  actions: { gap: space.md, width: "100%", maxWidth: 320, alignSelf: "center" },
});
