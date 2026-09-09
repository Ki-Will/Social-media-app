import React from "react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-2xl bg-surface/40 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4 shrink-0">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-text-muted max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
