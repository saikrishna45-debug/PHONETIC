"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Context ─────────────────────────────────────────────────── */
interface DialogContextValue {
  open: boolean;
  onClose: () => void;
}
const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  onClose: () => {},
});

/* ── Root ────────────────────────────────────────────────────── */
interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
function Dialog({ open, onClose, children }: DialogProps) {
  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ open, onClose }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] animate-in"
        aria-hidden="true"
        onClick={onClose}
      />
      {children}
    </DialogContext.Provider>
  );
}

/* ── Panel (the white dialog box) ────────────────────────────── */
interface DialogPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}
const sizeMap = {
  sm:   "max-w-sm",
  md:   "max-w-lg",
  lg:   "max-w-2xl",
  xl:   "max-w-4xl",
  full: "max-w-[95vw]",
};
function DialogPanel({ className, size = "md", children, ...props }: DialogPanelProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        "z-50 w-full bg-white rounded-2xl shadow-lg",
        "animate-in",
        sizeMap[size],
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────────── */
interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
}
function DialogHeader({ className, showClose = true, children, ...props }: DialogHeaderProps) {
  const { onClose } = React.useContext(DialogContext);
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {showClose && (
        <button
          onClick={onClose}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ── Title ───────────────────────────────────────────────────── */
function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-base font-semibold text-slate-900 leading-tight", className)}
      {...props}
    />
  );
}

/* ── Description ─────────────────────────────────────────────── */
function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-500 mt-1 leading-relaxed", className)} {...props} />
  );
}

/* ── Body ────────────────────────────────────────────────────── */
function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-5", className)} {...props} />;
}

/* ── Footer ──────────────────────────────────────────────────── */
function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
};
