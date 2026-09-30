import type {
  RecommendedMatch,
  ActivityItem,
  BrandInsight,
  MarketPriceTrend,
  ResalePredictionResult,
  UserProfile,
} from "@/types/index";
import { MOCK_PHONES } from "./phones";

// ─── User ────────────────────────────────────────────────────────────────────

export const MOCK_USER: UserProfile = {
  id: "user-001",
  name: "Sai",
  email: "sai@phonetic.ai",
  plan: "premium",
  budgetRange: { min: 20000, max: 50000 },
  primaryUsage: "Gaming & Entertainment",
  preferredBrands: ["Samsung", "OnePlus", "Apple"],
  keyFeatures: ["Performance", "Battery", "Camera"],
  savedPhoneIds: ["oneplus-12", "samsung-galaxy-s24", "google-pixel-8"],
  createdAt: "2024-01-15T10:00:00Z",
};

// ─── Recommendations ──────────────────────────────────────────────────────────

export const MOCK_RECOMMENDATIONS: RecommendedMatch[] = [
  {
    phone: MOCK_PHONES.find((p) => p.id === "iphone-15")!,
    matchScore: 92,
    matchedReasons: [
      "Fits within your ₹20k–₹50k+ budget after deals",
      "Top-rated camera quality matching your photography usage",
      "iOS ecosystem preferred based on your profile",
    ],
    tradeoffs: ["60Hz display for the price range"],
    tag: "Best Overall",
  },
  {
    phone: MOCK_PHONES.find((p) => p.id === "oneplus-12r")!,
    matchScore: 89,
    matchedReasons: [
      "Best battery life in this price range",
      "Gaming-grade performance with 2K display",
      "80W fast charging keeps you powered through the day",
    ],
    tradeoffs: ["Older Snapdragon 8 Gen 1 chip"],
    tag: "Best Battery",
  },
  {
    phone: MOCK_PHONES.find((p) => p.id === "samsung-galaxy-s23")!,
    matchScore: 85,
    matchedReasons: [
      "Outstanding Snapdragon performance well within budget",
      "Compact form factor preferred by similar users",
      "Trusted Samsung service & update track record",
    ],
    tradeoffs: ["Small battery capacity", "Slower 25W charging"],
    tag: "Best Value",
  },
];

// ─── Resale Prediction ────────────────────────────────────────────────────────

export const MOCK_RESALE_RESULT: ResalePredictionResult = {
  id: "resale-pred-001",
  predictedValue: 28490,
  currency: "INR",
  confidenceScore: 0.92,
  priceRange: { min: 26800, max: 30200 },
  depreciationForecast: [
    { period: "Now", estimatedValue: 28490 },
    { period: "+3 Months", estimatedValue: 26500 },
    { period: "+6 Months", estimatedValue: 24200 },
    { period: "+12 Months", estimatedValue: 20800 },
  ],
  featureImpacts: [
    {
      feature: "Battery Health (88%)",
      impact: "positive",
      description: "Above-average battery health boosts resale demand",
      percentageImpact: 8,
    },
    {
      feature: "Original Box Included",
      impact: "positive",
      description: "Buyers pay a 5–8% premium for original packaging",
      percentageImpact: 6,
    },
    {
      feature: "Minor Screen Scratches",
      impact: "negative",
      description: "Reduces perceived condition from Good to Fair",
      percentageImpact: -9,
    },
    {
      feature: "2 Years Old (2022 Model)",
      impact: "negative",
      description: "Standard lifecycle depreciation applied",
      percentageImpact: -18,
    },
  ],
  sellingTips: [
    "Sell within the next 30 days — the next Samsung announcement will push resale values down further.",
    "A factory reset and original box photos can increase buyer conversion by ~25%.",
    "List on OLX and Cashify simultaneously for best reach and competitive pricing.",
  ],
  createdAt: new Date().toISOString(),
};

// ─── Market Price Trends ──────────────────────────────────────────────────────

export const MOCK_PRICE_TRENDS: MarketPriceTrend[] = [
  { month: "Jan", newPrice: 180000, usedPrice: 120000, resaleValue: 80000 },
  { month: "Feb", newPrice: 178000, usedPrice: 118000, resaleValue: 78000 },
  { month: "Mar", newPrice: 175000, usedPrice: 115000, resaleValue: 75000 },
  { month: "Apr", newPrice: 172000, usedPrice: 112000, resaleValue: 72000 },
  { month: "May", newPrice: 170000, usedPrice: 110000, resaleValue: 70000 },
  { month: "Jun", newPrice: 168000, usedPrice: 108000, resaleValue: 68000 },
];

// ─── Brand Insights ────────────────────────────────────────────────────────────

export const MOCK_BRAND_INSIGHTS: BrandInsight[] = [
  { brand: "Apple", oneYearDepreciation: 20, resaleRetention: 80, topSegment: "iPhone 13 / 15" },
  { brand: "Samsung", oneYearDepreciation: 32, resaleRetention: 68, topSegment: "S-series" },
  { brand: "OnePlus", oneYearDepreciation: 38, resaleRetention: 62, topSegment: "Number series" },
  { brand: "Google", oneYearDepreciation: 35, resaleRetention: 65, topSegment: "Pixel 8" },
];

// ─── Activity History ─────────────────────────────────────────────────────────

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "act-1",
    type: "resale_prediction",
    title: "iPhone 13 Resale Prediction",
    description: "Estimated value: ₹28,490",
    timestamp: "2 hours ago",
  },
  {
    id: "act-2",
    type: "recommendation",
    title: "Top 5 Gaming Phones",
    description: "Personalised recommendations",
    timestamp: "5 hours ago",
  },
  {
    id: "act-3",
    type: "comparison",
    title: "Compared iPhone 15 & Samsung S24",
    description: "Side-by-side comparison",
    timestamp: "Yesterday",
  },
  {
    id: "act-4",
    type: "saved_phone",
    title: "Saved OnePlus 12",
    description: "Added to your saved list",
    timestamp: "2 days ago",
  },
];

// ─── Saved Phones ─────────────────────────────────────────────────────────────

export const MOCK_SAVED_PHONES = MOCK_PHONES.filter((p) =>
  MOCK_USER.savedPhoneIds.includes(p.id)
);

