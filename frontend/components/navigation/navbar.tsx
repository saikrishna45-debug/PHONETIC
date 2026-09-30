"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="Phonetic home">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-base leading-none">P</span>
            </div>
            <span className="text-slate-900 font-bold text-base tracking-tight">Phonetic</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "hover:text-slate-900 transition-colors",
                    isActive ? "text-emerald-600 font-semibold" : ""
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Account actions */}
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden text-slate-700 sm:inline-flex"><Link href="/login">Login</Link></Button>
            <Button asChild size="sm" className="hidden rounded-xl px-5 sm:inline-flex"><Link href="/signup">Sign Up</Link></Button>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileOpen && (
          <div
            id="mobile-nav"
            className="animate-in space-y-1 border-t border-slate-100 bg-white px-5 py-4 sm:px-8 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center py-2.5 text-sm font-medium rounded-lg px-3 transition-colors",
                  pathname === link.href
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-3">
              <Button asChild variant="outline" className="w-full flex-1" size="sm"><Link href="/login" onClick={() => setMobileOpen(false)}>Login</Link></Button>
              <Button asChild className="w-full flex-1" size="sm"><Link href="/signup" onClick={() => setMobileOpen(false)}>Sign Up</Link></Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
