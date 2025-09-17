import React from "react";

export function GroupsIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 32 32">
  {/* Left Person */}
  <circle cx="10" cy="10" r="3" stroke="currentColor" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M5 20c0-3 2.5-5 5.5-5h0C13 15 15 17 15 20" />

  {/* Right Person */}
  <circle cx="22" cy="10" r="3" stroke="currentColor" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20c0-3 2.5-5 5.5-5h0c3 0 5.5 2 5.5 5" />

 
</svg>

  );
} 