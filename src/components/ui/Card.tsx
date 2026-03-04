import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "pink" | "blue" | "green" | "gold";
}

const glowMap = {
  pink: "glow-pink",
  blue: "glow-blue",
  green: "glow-green",
  gold: "glow-gold",
};

export function Card({ glow, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6",
        glow && glowMap[glow],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
