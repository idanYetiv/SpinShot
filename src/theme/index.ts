export const colors = {
  bgDark: "#0A0A0A",
  bgPurple: "#1A0B2E",
  pink: "#FF10F0",
  blue: "#00D4FF",
  green: "#39FF14",
  red: "#FF3131",
  gold: "#FFD700",
  purple: "#A855F7",
  orange: "#F97316",
  glass: "rgba(255,255,255,0.05)",
  glassBorder: "rgba(255,255,255,0.12)",
  text: "#FFFFFF",
  textSecondary: "#A0A0B0",
} as const;

export type NeonColor = "pink" | "blue" | "green" | "red" | "gold";

export function glow(color: string, strength = 0.4): string {
  return `0 0 20px ${hexToRgba(color, strength)}, 0 0 50px ${hexToRgba(color, strength / 3)}`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export const textGlow = (color: string) => ({
  textShadowColor: hexToRgba(color, 0.7),
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 14,
});

export const radius = { sm: 10, md: 14, lg: 20, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
