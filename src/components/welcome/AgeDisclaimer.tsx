import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

const STORAGE_KEY = "spinshot-age-confirmed";

export function AgeDisclaimer() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const confirmed = localStorage.getItem(STORAGE_KEY);
    if (!confirmed) setShow(true);
  }, []);

  function handleConfirm() {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  }

  function handleCancel() {
    window.location.href = "https://www.google.com";
  }

  return (
    <Modal open={show}>
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="text-5xl">🔞</div>
        <h2 className="text-2xl font-bold">{t("ageDisclaimer.title")}</h2>
        <p className="text-text-secondary">{t("ageDisclaimer.message")}</p>
        <div className="flex w-full flex-col gap-3">
          <Button variant="primary" glow onClick={handleConfirm}>
            {t("ageDisclaimer.confirm")}
          </Button>
          <Button variant="ghost" onClick={handleCancel}>
            {t("ageDisclaimer.cancel")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
