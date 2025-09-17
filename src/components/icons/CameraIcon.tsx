import React from "react";

export function CameraIcon({ className = "" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" />
      <circle cx="12" cy="13.5" r="3.5" stroke="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
