"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { AppHeader } from "@/components/layout/app-header";
import { MOCK_USER } from "@/data";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  /** Extra class for the <main> content area */
  contentClassName?: string;
}

export function AppShell({ children, contentClassName }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const initials = MOCK_USER.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const routeName = pathname.split("/").filter(Boolean).at(-1) ?? "dashboard";
  const pageTitle = routeName === "dashboard"
    ? "Dashboard"
    : routeName.replaceAll("-", " ").replace(/\b\w/g, letter => letter.toUpperCase());

  function mockLogout() {
    setMobileMenuOpen(false);
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden md:block"><Sidebar onLogout={mockLogout} /></div>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AppHeader title={pageTitle} userName={MOCK_USER.name} initials={initials} onMenuClick={() => setMobileMenuOpen(true)} />
        <main id="main-content" className={cn("flex-1 p-4 sm:p-6 lg:p-8", contentClassName)}>
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
      <MobileNav open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onLogout={mockLogout} />
    </div>
  );
}
