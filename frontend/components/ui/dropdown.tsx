"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/* ── Context ─────────────────────────────────────────────────── */
interface DropdownContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const DropdownContext = React.createContext<DropdownContextValue>({
  open: false,
  setOpen: () => {},
});

/* ── Root ────────────────────────────────────────────────────── */
interface DropdownProps {
  children: React.ReactNode;
  className?: string;
}
function Dropdown({ children, className }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

/* ── Trigger ─────────────────────────────────────────────────── */
function DropdownTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen } = React.useContext(DropdownContext);
  return (
    <Slot
      className={cn("cursor-pointer", className)}
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-haspopup="menu"
    >
      {children}
    </Slot>
  );
}

/* ── Content (the floating panel) ────────────────────────────── */
interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right";
  width?: string;
}
function DropdownContent({
  children,
  className,
  align = "left",
  width = "w-52",
  ...props
}: DropdownContentProps) {
  const { open } = React.useContext(DropdownContext);
  if (!open) return null;
  return (
    <div
      role="menu"
      className={cn(
        "absolute z-50 top-full mt-2 bg-white border border-slate-100",
        "rounded-xl shadow-lg p-1 animate-in",
        width,
        align === "right" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Item ────────────────────────────────────────────────────── */
interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  destructive?: boolean;
}
function DropdownItem({ children, className, icon, destructive, onClick, ...props }: DropdownItemProps) {
  const { setOpen } = React.useContext(DropdownContext);
  return (
    <button
      role="menuitem"
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium",
        "transition-colors cursor-pointer text-left",
        destructive
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    >
      {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
      {children}
    </button>
  );
}

/* ── Separator ───────────────────────────────────────────────── */
function DropdownSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px bg-slate-100", className)} />;
}

/* ── Label (non-interactive group heading) ───────────────────── */
function DropdownLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider", className)}>
      {children}
    </p>
  );
}

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
};
