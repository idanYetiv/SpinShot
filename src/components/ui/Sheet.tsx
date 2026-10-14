import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { colors, glow, radius, space } from "../../theme";
import { useDirectionStyle } from "../../hooks/useDirection";

interface SheetProps {
  visible: boolean;
  onClose?: () => void;
  children: ReactNode;
}

/** Centered neon dialog. Tapping the backdrop closes it only if onClose is given. */
export function Sheet({ visible, onClose, children }: SheetProps) {
  const directionStyle = useDirectionStyle();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {onClose ? <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessible={false} /> : null}
        <View style={[styles.card, directionStyle]}>
          <View style={{ gap: space.lg }}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "center", padding: space.xl },
  card: {
    backgroundColor: colors.bgPurple,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: space.xl,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    boxShadow: glow(colors.pink, 0.25),
  },
});
