import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  function toggle() {
    const next = i18n.language === "en" ? "he" : "en";
    i18n.changeLanguage(next);
  }

  return (
    <button
      onClick={toggle}
      className="rounded-lg border border-glass-border px-3 py-1.5 text-sm text-text-secondary hover:text-white hover:border-neon-blue transition-colors cursor-pointer"
    >
      {i18n.language === "en" ? "עברית" : "English"}
    </button>
  );
}
