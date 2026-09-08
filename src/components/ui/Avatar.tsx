import React from "react";
import { User } from "lucide-react";

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  className = "",
  isOnline,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const initial = name ? name.trim()[0].toUpperCase() : null;

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`rounded-full overflow-hidden bg-brand/10 border border-brand/20 text-brand font-bold flex items-center justify-center select-none ${sizeClasses[size]}`}
      >
        {src ? (
          <img src={src} alt={name || "Avatar"} className="w-full h-full object-cover" />
        ) : initial ? (
          <span>{initial}</span>
        ) : (
          <User className="w-1/2 h-1/2 text-brand" />
        )}
      </div>
      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-background ${
            size === "sm" ? "w-2 h-2" : "w-3 h-3"
          } ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`}
        />
      )}
    </div>
  );
};
