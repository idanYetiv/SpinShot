import { type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  glow?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-neon-pink text-white hover:brightness-110",
  secondary: "bg-neon-blue text-white hover:brightness-110",
  danger: "bg-neon-red text-white hover:brightness-110",
  ghost: "bg-transparent border border-glass-border text-white hover:bg-glass",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
};

const glowStyles: Record<Variant, string> = {
  primary: "glow-pink",
  secondary: "glow-blue",
  danger: "glow-red",
  ghost: "",
};

export function Button({
  variant = "primary",
  size = "md",
  glow = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-xl font-bold transition-all duration-200 cursor-pointer",
        "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variantStyles[variant],
        sizeStyles[size],
        glow && glowStyles[variant],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
