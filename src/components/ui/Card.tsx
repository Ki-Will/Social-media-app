import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outline" | "interactive";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "default", className = "", ...props }, ref) => {
    const variants = {
      default: "bg-surface border border-border shadow-xs",
      elevated: "bg-surface-elevated border border-border/80 shadow-md",
      outline: "bg-transparent border border-border",
      interactive:
        "bg-surface border border-border shadow-xs hover:border-brand/40 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]",
    };

    return (
      <div
        ref={ref}
        className={`rounded-xl p-5 ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`flex items-center justify-between pb-4 border-b border-border mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <h3 className={`text-lg font-bold text-text-primary tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <p className={`text-sm text-text-muted mt-0.5 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => <div className={className} {...props}>{children}</div>;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`pt-4 border-t border-border mt-4 flex items-center justify-end gap-3 ${className}`} {...props}>
    {children}
  </div>
);
