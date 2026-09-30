"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Dropdown, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/ui/dropdown";
import Link from "next/link";

interface AppHeaderProps {
  title: string;
  userName: string;
  initials: string;
  onMenuClick: () => void;
}

export function AppHeader({ title, userName, initials, onMenuClick }: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-xs sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-controls="app-mobile-drawer"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 md:hidden"
        >
          <span className="flex flex-col gap-1" aria-hidden="true"><span className="h-0.5 w-4 rounded bg-current" /><span className="h-0.5 w-4 rounded bg-current" /><span className="h-0.5 w-4 rounded bg-current" /></span>
        </button>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-sm font-black text-white md:hidden">P</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">{title}</p>
          <p className="hidden text-[11px] text-slate-500 sm:block">Your Smartphone. Your Smart Decision.</p>
        </div>
      </div>

      <div className="hidden w-56 lg:block xl:w-72">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input type="search" placeholder="Search phones..." aria-label="Search phones" className="h-9 rounded-lg bg-slate-50 pl-9 text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/app/settings#notifications" aria-label="Notification preferences" className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
          <Bell className="h-4 w-4" />
        </Link>
        <Dropdown>
          <DropdownTrigger>
            <button type="button" aria-label={`${userName} profile menu`} className="flex min-h-10 items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">{initials}</span>
              <span className="hidden text-left text-sm font-semibold text-slate-800 sm:block">{userName}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
            </button>
          </DropdownTrigger>
          <DropdownContent align="right" width="w-48">
            <DropdownItem onClick={() => router.push("/app/profile")}>Profile</DropdownItem>
            <DropdownItem onClick={() => router.push("/app/settings")}>Settings</DropdownItem>
            <DropdownSeparator />
            <DropdownItem destructive onClick={() => router.push("/")}>Log out</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  );
}
