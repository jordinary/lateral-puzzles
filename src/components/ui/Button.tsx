import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "accent" | "ghost";
  small?: boolean;
};

export default function Button({ variant = "default", small, className, ...rest }: ButtonProps) {
  const base = "mono slow-ease px-4 py-2 border text-sm" + (small ? " px-3 py-1 text-xs" : "");
  const styleByVariant: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default: "bg-[var(--surface-2)] border-[var(--border)] hover:bg-[var(--surface)] active:translate-y-[1px]",
    accent: "bg-[var(--accent)]/10 border-[var(--accent)] text-black hover:bg-[var(--accent)]/14",
    ghost: "bg-transparent border-transparent hover:border-[var(--border)]",
  };
  return <button className={[base, styleByVariant[variant], className].filter(Boolean).join(" ")} {...rest} />;
}


