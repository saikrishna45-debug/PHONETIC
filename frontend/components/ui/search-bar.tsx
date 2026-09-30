"use client";

import React, { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  id?: string;
}

const sizeStyles = {
  sm:  "h-8  text-xs pl-8  pr-8",
  md:  "h-10 text-sm pl-9  pr-9",
  lg:  "h-12 text-sm pl-11 pr-10",
};
const iconSizeStyles = {
  sm:  "h-3.5 w-3.5 left-2.5",
  md:  "h-4   w-4   left-3",
  lg:  "h-5   w-5   left-3.5",
};

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSubmit,
  onClear,
  className,
  size = "md",
  autoFocus = false,
  id,
}: SearchBarProps) {
  const [internal, setInternal] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!controlled) setInternal(v);
    onChange?.(v);
  };

  const handleClear = () => {
    if (!controlled) setInternal("");
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit?.(current);
    if (e.key === "Escape") handleClear();
  };

  return (
    <div className={cn("relative", className)}>
      {/* Search icon */}
      <Search
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none",
          iconSizeStyles[size]
        )}
      />

      <input
        ref={inputRef}
        id={id}
        type="search"
        role="searchbox"
        placeholder={placeholder}
        value={current}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white text-slate-900",
          "placeholder:text-slate-400",
          "transition-colors duration-150",
          "focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
          "[appearance:textfield] [&::-webkit-search-cancel-button]:hidden",
          sizeStyles[size]
        )}
      />

      {/* Clear button */}
      {current.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
