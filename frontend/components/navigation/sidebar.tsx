"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Tag,
  Smartphone,
  GitCompareArrows,
  BarChart3,
  History,
  UserRound,
  Settings,
  LogOut,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
  onNavigate?: () => void;
}

const NAV_GROUPS: { group: string; items: { label: string; href: string; icon: LucideIcon }[] }[] = [
  { group: "MAIN", items: [{ label: "Dashboard", href: "/app/dashboard", icon: House }] },
  {
    group: "SMARTPHONE",
    items: [
      { label: "Sell My Phone", href: "/app/sell", icon: Tag },
      { label: "Find My Phone", href: "/app/buy", icon: Smartphone },
      { label: "Compare Phones", href: "/app/compare", icon: GitCompareArrows },
    ],
  },
  {
    group: "ANALYTICS",
    items: [
      { label: "Price Insights", href: "/app/insights", icon: BarChart3 },
      { label: "My History", href: "/app/history", icon: History },
    ],
  },
  {
    group: "ACCOUNT",
    items: [
      { label: "Profile", href: "/app/profile", icon: UserRound },
      { label: "Saved Phones", href: "/app/saved", icon: Bookmark },
      { label: "Settings", href: "/app/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ onLogout, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white md:sticky md:top-0 md:h-screen">
      {/* Brand logo — matches reference: green "P" + "Phonetic" wordmark */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        {/* Green P lettermark */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-700">
          <span className="text-white font-black text-base leading-none">P</span>
        </div>
        <span className="text-base font-bold tracking-normal text-slate-950">PHONETIC</span>
      </div>

      {/* Navigation groups */}
      <nav aria-label="Application navigation" className="flex-1 space-y-6 px-3 py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.group}>
            <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400">{group.group}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/app/dashboard" && pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                        isActive
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive ? "text-emerald-600" : "text-slate-400"
                          )}
                        />
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="border-t border-slate-100 px-3 py-4">
        <button type="button" onClick={onLogout} className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
          <LogOut className="h-4 w-4 text-slate-400" />
          Logout
        </button>
      </div>
    </aside>
  );
}
