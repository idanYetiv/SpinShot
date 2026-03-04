import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const RTL_LANGUAGES = ["he", "ar"];

export function useDirection() {
  const { i18n } = useTranslation();
  const isRTL = RTL_LANGUAGES.includes(i18n.language);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  return { isRTL, language: i18n.language };
}
