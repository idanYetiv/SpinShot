import { useEffect } from "react";
import { Platform, type ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";

/** Layout direction for the current language. */
export function useDirection(): "rtl" | "ltr" {
  const { i18n } = useTranslation();
  return i18n.language === "he" ? "rtl" : "ltr";
}

/**
 * Style that flips layout for RTL without an app reload. Native uses Yoga's
 * `direction` style; react-native-web doesn't support it, so on web we set
 * the document `dir` instead (see useDocumentDirection).
 */
export function useDirectionStyle(): ViewStyle {
  const direction = useDirection();
  return Platform.OS === "web" ? {} : { direction };
}

export function useDocumentDirection() {
  const direction = useDirection();
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.documentElement.dir = direction;
    }
  }, [direction]);
}
