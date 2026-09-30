"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Sidebar } from "@/components/navigation/sidebar";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileNav({ open, onClose, onLogout }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button type="button" aria-label="Close navigation menu" onClick={onClose} className="absolute inset-0 bg-slate-950/30" />
      <div id="app-mobile-drawer" role="dialog" aria-modal="true" aria-label="Application menu" className="absolute inset-y-0 left-0 flex w-[min(19rem,86vw)] flex-col bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <span className="text-sm font-bold tracking-normal text-slate-950">APPLICATION MENU</span>
          <button type="button" onClick={onClose} aria-label="Close navigation menu" className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <Sidebar onLogout={onLogout} onNavigate={onClose} />
      </div>
    </div>
  );
}
