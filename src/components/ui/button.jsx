import React from "react";
import { cn } from "@/lib/utils";

export const Button = React.forwardRef(function Button(
  { className, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex h-10 items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
