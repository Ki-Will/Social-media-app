import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "neutral" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "brand",
  size = "md",
  className = "",
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-medium rounded-full transition-colors shrink-0";

  const variants = {
    brand: "bg-brand/10 text-brand border border-brand/20",
    neutral: "bg-surface-hover text-text-secondary border border-border",
    success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    error: "bg-red-500/10 text-red-500 border border-red-500/20",
    info: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    outline: "bg-transparent text-text-secondary border border-border",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider",
    md: "text-xs px-2.5 py-1 font-medium",
  };

  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
};
