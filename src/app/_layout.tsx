import "../i18n";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { usePlayerStore } from "../store/playerStore";
import { colors } from "../theme";
import { useDocumentDirection } from "../hooks/useDirection";

export default function RootLayout() {
  const { i18n } = useTranslation();
  const language = usePlayerStore((s) => s.language);
  useDocumentDirection();

  // Restore the saved language once the persisted store hydrates.
  useEffect(() => {
    if (i18n.language !== language) void i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bgDark },
          animation: "fade",
        }}
      >
        <Stack.Screen name="game/[code]" options={{ gestureEnabled: false }} />
        <Stack.Screen name="results/[code]" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}
