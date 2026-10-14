import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../../theme";
import { formatTime } from "../../lib/utils";

/** Counts down to `endsAt`; calls onEnd once when time is up. */
export function Timer({ endsAt, onEnd }: { endsAt: number; onEnd: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  const remaining = Math.max(0, (endsAt - now) / 1000);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining <= 0) onEnd();
  }, [remaining, onEnd]);

  const urgent = remaining < 60;
  return <Text style={[styles.time, urgent && { color: colors.red }]}>⏱ {formatTime(remaining)}</Text>;
}

const styles = StyleSheet.create({
  time: { color: colors.blue, fontSize: 18, fontWeight: "800", fontVariant: ["tabular-nums"] },
});
