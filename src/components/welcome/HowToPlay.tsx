import { useTranslation } from "react-i18next";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface HowToPlayProps {
  open: boolean;
  onClose: () => void;
}

export function HowToPlay({ open, onClose }: HowToPlayProps) {
  const { t } = useTranslation();
  const steps = t("welcome.howToPlaySteps", { returnObjects: true }) as string[];

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-glow-blue">
          {t("welcome.howToPlay")}
        </h2>
        <ol className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon-pink/20 text-sm font-bold text-neon-pink">
                {i + 1}
              </span>
              <span className="text-text-secondary pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <Button variant="ghost" onClick={onClose} className="mt-2">
          Got it!
        </Button>
      </div>
    </Modal>
  );
}
