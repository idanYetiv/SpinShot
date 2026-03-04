import { cn } from "../../lib/utils";

type BadgeVariant = "pink" | "blue" | "green" | "red" | "gold";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  pink: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  blue: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  green: "bg-neon-green/20 text-neon-green border-neon-green/30",
  red: "bg-neon-red/20 text-neon-red border-neon-red/30",
  gold: "bg-neon-gold/20 text-neon-gold border-neon-gold/30",
};

export function Badge({ variant = "pink", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
