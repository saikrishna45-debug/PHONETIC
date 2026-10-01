const configuredApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000")
  .replace(/\/+$/, "");
const apiBaseUrl = configuredApiUrl.endsWith("/api/v1")
  ? configuredApiUrl
  : `${configuredApiUrl}/api/v1`;

export const APP_CONFIG = {
  name: "Phonetic",
  tagline: "Your Smartphone. Your Smart Decision.",
  version: "0.1.0",
  apiBaseUrl,
} as const;

export { PHONE_BRANDS } from "@/data/phones";

export const PHONE_CONDITIONS = [
  {
    id: "like_new",
    label: "Like New",
    description: "No scratches, dents, or signs of use. Battery health ≥ 95%.",
    discountFactor: 1.0,
  },
  {
    id: "good",
    label: "Good",
    description: "Minor signs of use. Battery health 85–95%.",
    discountFactor: 0.85,
  },
  {
    id: "fair",
    label: "Fair",
    description: "Visible scratches or scuffs. Fully functional. Battery health 75–85%.",
    discountFactor: 0.7,
  },
  {
    id: "poor",
    label: "Poor",
    description: "Heavy wear, cracked screen or back, degraded battery.",
    discountFactor: 0.45,
  },
] as const;

export const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"] as const;
export const RAM_OPTIONS = ["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"] as const;

export const PRIMARY_USE_CASES = [
  { id: "gaming", label: "Gaming & Entertainment" },
  { id: "photography", label: "Camera & Photography" },
  { id: "battery", label: "Battery Life & Travel" },
  { id: "everyday", label: "Everyday & Social Media" },
  { id: "work", label: "Work & Productivity" },
  { id: "budget", label: "Best Value for Money" },
] as const;

/** Sidebar navigation groups matching the dashboard reference screenshot exactly */
export const SIDEBAR_NAV = [
  {
    group: "MAIN",
    items: [
      { label: "Dashboard", href: "/app/dashboard", icon: "LayoutDashboard" },
    ],
  },
  {
    group: "SMARTPHONE",
    items: [
      { label: "Sell My Phone", href: "/app/sell", icon: "Tag" },
      { label: "Find My Phone", href: "/app/buy", icon: "Search" },
      { label: "Compare Phones", href: "/app/compare", icon: "ArrowLeftRight" },
    ],
  },
  {
    group: "ANALYTICS",
    items: [
      { label: "Price Insights", href: "/app/insights", icon: "BarChart3" },
      { label: "Saved Phones", href: "/app/saved", icon: "Bookmark" },
      { label: "History", href: "/app/history", icon: "Clock" },
    ],
  },
  {
    group: "ACCOUNT",
    items: [
      { label: "Profile", href: "/app/profile", icon: "User" },
      { label: "Settings", href: "/app/settings", icon: "Settings" },
    ],
  },
] as const;
