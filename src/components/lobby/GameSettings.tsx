import { useTranslation } from "react-i18next";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface GameSettingsProps {
  language: string;
  gameLength: number;
}

export function GameSettings({ language, gameLength }: GameSettingsProps) {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-wrap gap-3">
      <Badge variant="blue">{t(`language.${language}`)}</Badge>
      <Badge variant="pink">{t("create.minutes", { count: gameLength })}</Badge>
    </Card>
  );
}
