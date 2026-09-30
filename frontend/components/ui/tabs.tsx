"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Context ─────────────────────────────────────────────────── */
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: "underline" | "pills" | "boxed";
}
const TabsContext = React.createContext<TabsContextValue>({
  activeTab: "",
  setActiveTab: () => {},
  variant: "underline",
});

/* ── Root ────────────────────────────────────────────────────── */
interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
  variant?: "underline" | "pills" | "boxed";
  onChange?: (tab: string) => void;
}
function Tabs({ defaultTab, children, className, variant = "underline", onChange }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  const handleChange = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange, variant }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ── Tab List ────────────────────────────────────────────────── */
type TabListProps = React.HTMLAttributes<HTMLDivElement>;
function TabList({ children, className, ...props }: TabListProps) {
  const { variant } = React.useContext(TabsContext);
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-0.5",
        variant === "underline" && "border-b border-slate-200",
        variant === "pills"    && "gap-2",
        variant === "boxed"    && "bg-slate-100 p-1 rounded-xl gap-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Tab (individual trigger) ────────────────────────────────── */
interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
}
function Tab({ id, children, className, ...props }: TabProps) {
  const { activeTab, setActiveTab, variant } = React.useContext(TabsContext);
  const isActive = activeTab === id;

  const variantStyles = {
    underline: cn(
      "relative pb-3 pt-1 px-3 text-sm font-medium transition-colors",
      "border-b-2 -mb-px",
      isActive
        ? "text-emerald-700 border-emerald-600"
        : "text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300"
    ),
    pills: cn(
      "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
      isActive
        ? "bg-emerald-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    ),
    boxed: cn(
      "flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-center",
      isActive
        ? "bg-white text-slate-900 shadow-sm"
        : "text-slate-500 hover:text-slate-700"
    ),
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      id={`tab-${id}`}
      onClick={() => setActiveTab(id)}
      className={cn(variantStyles[variant], "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1", className)}
      {...props}
    >
      {children}
    </button>
  );
}

/* ── Tab Panel ───────────────────────────────────────────────── */
interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}
function TabPanel({ id, children, className, ...props }: TabPanelProps) {
  const { activeTab } = React.useContext(TabsContext);
  if (activeTab !== id) return null;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={cn("animate-in", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabList, Tab, TabPanel };
