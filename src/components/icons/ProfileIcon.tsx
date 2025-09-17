import React from "react";

export function ProfileIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
  {/* Head */}
  <circle cx="12" cy="7" r="4" stroke="currentColor" />

  {/* Shoulders / Body */}
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    d="M5 20c0-4 3.5-6 7-6s7 2 7 6"
  />
</svg>

  );
} 