import type { MissionCategory } from "../../lib/types";
import { colors } from "../../theme";

export const CATEGORY_COLORS: Record<MissionCategory, string> = {
  solo: colors.pink,
  duo: colors.blue,
  group: colors.green,
  truth: colors.gold,
  skill: colors.red,
  speed: colors.purple,
  secret: colors.orange,
};
