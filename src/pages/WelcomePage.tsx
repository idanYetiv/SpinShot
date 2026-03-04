import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Logo } from "../components/welcome/Logo";
import { AgeDisclaimer } from "../components/welcome/AgeDisclaimer";
import { HowToPlay } from "../components/welcome/HowToPlay";
import { LanguageToggle } from "../components/welcome/LanguageToggle";
import { Button } from "../components/ui/Button";

export function WelcomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 p-6">
      <AgeDisclaimer />
      <HowToPlay open={showHowTo} onClose={() => setShowHowTo(false)} />

      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <Logo />

      <motion.div
        className="flex w-full max-w-xs flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="primary"
          size="lg"
          glow
          onClick={() => navigate("/create")}
          className="w-full"
        >
          {t("welcome.createGame")}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          glow
          onClick={() => navigate("/join")}
          className="w-full"
        >
          {t("welcome.joinGame")}
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => setShowHowTo(true)}
          className="w-full"
        >
          {t("welcome.howToPlay")}
        </Button>
      </motion.div>
    </div>
  );
}
