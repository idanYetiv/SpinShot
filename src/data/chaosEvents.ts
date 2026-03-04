import type { ChaosEvent } from "../lib/types";

export const chaosEvents: ChaosEvent[] = [
  {
    id: "chaos-01",
    text: {
      en: "DOUBLE SPIN! Spin again after this turn!",
      he: "סיבוב כפול! סובב שוב אחרי התור הזה!",
    },
    effect: "double_spin",
  },
  {
    id: "chaos-02",
    text: {
      en: "REVERSE! Turn order is now reversed!",
      he: "הפוך! סדר התורות התהפך!",
    },
    effect: "reverse_order",
  },
  {
    id: "chaos-03",
    text: {
      en: "EVERYONE DRINKS! Everybody takes a sip!",
      he: "כולם שותים! כל אחד לוקח לגימה!",
    },
    effect: "everyone_drinks",
  },
  {
    id: "chaos-04",
    text: {
      en: "SAFE ROUND! No penalty this turn — lucky you!",
      he: "סיבוב בטוח! אין עונש בתור הזה — מזל שלך!",
    },
    effect: "safe_round",
  },
  {
    id: "chaos-05",
    text: {
      en: "TRIPLE PENALTY! Next fail = 3 shots!",
      he: "עונש משולש! כישלון הבא = 3 שוטים!",
    },
    effect: "triple_penalty",
  },
  {
    id: "chaos-06",
    text: {
      en: "EVERYONE DRINKS! Cheers to chaos!",
      he: "כולם שותים! לחיים לכאוס!",
    },
    effect: "everyone_drinks",
  },
  {
    id: "chaos-07",
    text: {
      en: "DOUBLE SPIN! The wheel demands more!",
      he: "סיבוב כפול! הגלגל דורש עוד!",
    },
    effect: "double_spin",
  },
  {
    id: "chaos-08",
    text: {
      en: "REVERSE! Plot twist — order flipped!",
      he: "הפוך! תפנית — הסדר התהפך!",
    },
    effect: "reverse_order",
  },
];
