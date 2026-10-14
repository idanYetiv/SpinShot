import type { ChaosEvent } from "../lib/types";

export const chaosEvents: ChaosEvent[] = [
  { id: "chaos-01", effect: "double_spin", text: { en: "DOUBLE SPIN! Spin again right after this one!", he: "סיבוב כפול! מסובבים שוב מיד אחרי זה!" } },
  { id: "chaos-02", effect: "reverse_order", text: { en: "REVERSE! Turn order is now reversed!", he: "הפוך! סדר התורות התהפך!" } },
  { id: "chaos-03", effect: "everyone_penalty", text: { en: "EVERYONE PAYS! Everybody takes a penalty!", he: "כולם משלמים! כל אחד חוטף עונש!" } },
  { id: "chaos-04", effect: "safe_round", text: { en: "SAFE TURN! No penalty this turn — lucky you!", he: "תור בטוח! אין עונש בתור הזה — מזל שלך!" } },
  { id: "chaos-05", effect: "triple_penalty", text: { en: "TRIPLE PENALTY! Fail this one = 3 penalties!", he: "עונש משולש! נכשלת במשימה הזו = 3 עונשים!" } },
  { id: "chaos-06", effect: "everyone_penalty", text: { en: "GROUP PENALTY! Cheers to chaos!", he: "עונש קבוצתי! לחיים לכאוס!" } },
  { id: "chaos-07", effect: "double_spin", text: { en: "DOUBLE SPIN! The wheel demands more!", he: "סיבוב כפול! הגלגל דורש עוד!" } },
  { id: "chaos-08", effect: "reverse_order", text: { en: "REVERSE! Plot twist — order flipped!", he: "הפוך! תפנית — הסדר התהפך!" } },
];
