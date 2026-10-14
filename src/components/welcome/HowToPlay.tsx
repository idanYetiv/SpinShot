import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, hexToRgba } from "../../theme";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { Title } from "../ui/Title";

export function HowToPlay({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const steps = t("welcome.howToPlaySteps", { returnObjects: true }) as string[];
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Title color={colors.blue} size={24}>{t("welcome.howToPlay")}</Title>
      <View style={styles.list}>
        {steps.map((step, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.num}>
              <Text style={styles.numText}>{i + 1}</Text>
            </View>
            <Text style={styles.step}>{step}</Text>
          </View>
        ))}
      </View>
      <Button title={t("common.gotIt")} variant="ghost" onPress={onClose} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  num: { width: 28, height: 28, borderRadius: 14, backgroundColor: hexToRgba(colors.pink, 0.2), alignItems: "center", justifyContent: "center" },
  numText: { color: colors.pink, fontWeight: "800" },
  step: { flex: 1, color: colors.textSecondary, fontSize: 15, lineHeight: 22, textAlign: "left" },
});
