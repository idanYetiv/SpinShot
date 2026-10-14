import { useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";
import { useTranslation } from "react-i18next";
import type { MissionCategory } from "../../lib/types";
import { WHEEL_CATEGORIES } from "../../lib/gameLogic";
import { colors, glow } from "../../theme";
import { CATEGORY_COLORS } from "./categoryColors";
import { Button } from "../ui/Button";
import { haptic } from "../../lib/haptics";

const SIZE = 280;
const C = SIZE / 2;
const R = C - 10;
const SEG = 360 / WHEEL_CATEGORIES.length;
const SPIN_MS = 3200;
const LABEL_FONT = Platform.OS === "web" ? "system-ui, -apple-system, sans-serif" : undefined;

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
}

/** Radial label angle, flipped on the lower half so text is never upside down. */
function labelAngle(mid: number): number {
  const a = ((mid % 360) + 360) % 360;
  return a > 0 && a < 180 ? mid - 90 : mid + 90;
}

interface WheelProps {
  onResult: (category: MissionCategory) => void;
  disabled?: boolean;
}

/**
 * Seven-segment wheel. The landing segment is chosen up front and the wheel
 * animates so that segment's centre stops under the top pointer.
 */
export function Wheel({ onResult, disabled }: WheelProps) {
  const { t } = useTranslation("game");
  const rotation = useSharedValue(0);
  const total = useRef(0);
  const [spinning, setSpinning] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  function spin() {
    if (spinning || disabled) return;
    setSpinning(true);
    haptic.spin();

    const index = Math.floor(Math.random() * WHEEL_CATEGORIES.length);
    const jitter = (Math.random() - 0.5) * SEG * 0.7;
    // Segment i is centred at (i + 0.5) * SEG clockwise from the top; rotating the
    // wheel clockwise by X brings the point at -X under the pointer.
    const landing = 360 - (index + 0.5) * SEG + jitter;
    const base = total.current - (total.current % 360);
    const target = base + 360 * (4 + Math.floor(Math.random() * 2)) + landing;
    total.current = target;

    rotation.value = withTiming(target, { duration: SPIN_MS, easing: Easing.bezier(0.15, 0.85, 0.25, 1) });
    setTimeout(() => {
      setSpinning(false);
      onResult(WHEEL_CATEGORIES[index]!);
    }, SPIN_MS + 150);
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.wheelBox}>
        <Text style={styles.pointer}>▼</Text>
        <Animated.View style={[styles.wheel, animatedStyle]}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {WHEEL_CATEGORIES.map((category, i) => {
              const start = i * SEG - 90;
              const end = start + SEG;
              const p1 = polar(start, R);
              const p2 = polar(end, R);
              const mid = start + SEG / 2;
              const label = polar(mid, R * 0.64);
              return (
                <G key={category}>
                  <Path
                    d={`M${C},${C} L${p1.x},${p1.y} A${R},${R} 0 0,1 ${p2.x},${p2.y} Z`}
                    fill={CATEGORY_COLORS[category]}
                    stroke={colors.bgDark}
                    strokeWidth={2}
                    opacity={0.9}
                  />
                  <SvgText
                    x={label.x}
                    y={label.y}
                    fill={colors.bgDark}
                    fontSize={13}
                    fontWeight="bold"
                    fontFamily={LABEL_FONT}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${labelAngle(mid)}, ${label.x}, ${label.y})`}
                  >
                    {t(`categories.${category}`)}
                  </SvgText>
                </G>
              );
            })}
            <Circle cx={C} cy={C} r={22} fill={colors.bgPurple} stroke={colors.pink} strokeWidth={3} />
          </Svg>
        </Animated.View>
      </View>
      <Button
        title={spinning ? t("spinning") : t("spin")}
        onPress={spin}
        disabled={spinning || disabled}
        size="lg"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 24 },
  wheelBox: { width: SIZE, height: SIZE, alignItems: "center" },
  wheel: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, boxShadow: glow(colors.pink, 0.35) },
  pointer: { position: "absolute", top: -16, zIndex: 2, fontSize: 28, color: colors.text },
  button: { minWidth: 180 },
});
