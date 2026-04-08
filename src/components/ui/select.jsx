import React, { createContext, useContext, useMemo } from "react";
import { cn } from "@/lib/utils";

const SelectContext = createContext(null);

export function Select({ value, onValueChange, children }) {
  const items = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === SelectContent) {
      React.Children.forEach(child.props.children, (nested) => {
        if (React.isValidElement(nested)) {
          items.push({ value: nested.props.value, label: nested.props.children });
        }
      });
    }
  });

  const selectedItem = items.find((item) => item.value === value);
  const contextValue = useMemo(
    () => ({
      value,
      onValueChange,
      items,
      selectedLabel: selectedItem?.label ?? "",
    }),
    [items, onValueChange, selectedItem?.label, value]
  );

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className }) {
  const context = useContext(SelectContext);

  return (
    <select
      value={context?.value}
      onChange={(event) => context?.onValueChange?.(event.target.value)}
      className={cn(
        "flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
        className
      )}
    >
      {context?.items.map((item) => (
        <option key={item.value} value={item.value} className="bg-slate-950 text-slate-100">
          {item.label}
        </option>
      ))}
    </select>
  );
}

export function SelectValue() {
  return null;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem() {
  return null;
}
