import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

const enabled = Platform.OS === "ios" || Platform.OS === "android";

export const haptic = {
  tap: () => enabled && void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  spin: () => enabled && void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => enabled && void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  fail: () => enabled && void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};
