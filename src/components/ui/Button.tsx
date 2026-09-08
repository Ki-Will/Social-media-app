import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "subtle";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none cursor-pointer";

    const variants = {
      primary: "bg-brand hover:bg-brand-hover text-white shadow-xs",
      secondary: "bg-surface-hover hover:bg-border text-text-primary border border-border/80",
      outline: "bg-transparent border border-border hover:bg-surface-hover text-text-primary",
      ghost: "bg-transparent hover:bg-surface-hover text-text-primary",
      subtle: "bg-brand/10 hover:bg-brand/20 text-brand font-semibold",
      danger: "bg-red-600 hover:bg-red-700 text-white shadow-xs",
    };

    const sizes = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5 min-h-[32px]",
      md: "text-sm px-4 py-2 gap-2 min-h-[40px]",
      lg: "text-base px-5 py-2.5 gap-2.5 min-h-[48px]",
      icon: "p-2 min-w-[38px] min-h-[38px] aspect-square",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
