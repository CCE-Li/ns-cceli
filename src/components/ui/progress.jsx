import React from "react";
import { cn } from "@/lib/utils";

export function Progress({ className, value = 0 }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-800", className)}>
      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${clamped}%` }} />
    </div>
  );
}
