import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Screen } from "../components/ui/Screen";
import { Card } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { Choice } from "../components/ui/Choice";
import { Button } from "../components/ui/Button";
import { Title } from "../components/ui/Title";
import { usePlayerStore } from "../store/playerStore";
import { useGameStore } from "../store/gameStore";
import { generateRoomCode } from "../lib/roomCode";
import type { Language } from "../lib/types";
import { colors } from "../theme";

export default function CreateGameScreen() {
  const { t, i18n } = useTranslation();
  const { name: savedName, playerId, setName, setLanguage } = usePlayerStore();
  const createRoom = useGameStore((s) => s.createRoom);

  const [name, setLocalName] = useState(savedName);
  const [language, setLang] = useState<Language>(i18n.language === "he" ? "he" : "en");
  const [length, setLength] = useState(20);

  function chooseLanguage(lang: Language) {
    setLang(lang);
    setLanguage(lang);
    void i18n.changeLanguage(lang);
  }

  function create() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setName(trimmed);
    const code = generateRoomCode();
    // Phase 2: insert the room in Supabase before navigating.
    createRoom({ code, host: { id: playerId, name: trimmed }, gameLength: length });
    router.replace(`/lobby/${code}`);
  }

  return (
    <Screen scroll center>
      <Title>{t("create.title")}</Title>
      <Card>
        <Field
          label={t("create.name")}
          placeholder={t("create.namePlaceholder")}
          value={name}
          onChangeText={setLocalName}
          maxLength={20}
          autoFocus
          returnKeyType="done"
        />
        <Choice
          label={t("create.language")}
          value={language}
          onChange={chooseLanguage}
          options={[
            { value: "en", label: t("language.en") },
            { value: "he", label: t("language.he") },
          ]}
        />
        <Choice
          label={t("create.gameLength")}
          value={length}
          onChange={setLength}
          color={colors.blue}
          options={[20, 30].map((m) => ({ value: m, label: t("create.minutes", { count: m }) }))}
        />
        <Button title={t("create.createRoom")} size="lg" onPress={create} disabled={!name.trim()} />
      </Card>
      <Button title={t("common.back")} variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
