import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-emerald-400",
        className
      )}
      {...props}
    />
  );
});
