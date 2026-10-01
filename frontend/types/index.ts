// ------------------------------------
// Core Phone Types
// ------------------------------------

export interface Phone {
  id: string;
  brand: string;
  model: string;
  variant: string;          // e.g. "128GB Blue"
  price: number;            // current market / recommended price (INR)
  launchPrice: number;      // original launch price (INR)
  currentPrice: number;     // current new price (INR)
  ram: string;              // e.g. "8GB"
  storage: string;          // e.g. "128GB"
  processor: string;
  battery: string;          // e.g. "4383 mAh"
  camera: string;           // main rear camera summary
  display: string;          // e.g. "6.1\" Super Retina XDR OLED"
  refreshRate: string;      // e.g. "60Hz" or "120Hz"
  operatingSystem: string;
  fiveG: boolean;
  launchYear: number;
  rating: number;           // 0–5
  image: string;            // path to public image or placeholder
  pros: string[];
  cons: string[];
  highlights: string[];
  recommendationProfile?: PhoneRecommendationProfile;
}

export interface PhoneRecommendationProfile {
  ramGb: number;
  storageGb: number;
  batteryMah: number;
  cameraMp: number;
  performanceScore: number;
  batteryScore: number;
  cameraScore: number;
  displayScore: number;
  usageTags: RecommendationUsage[];
  category: "flagship" | "midrange" | "budget";
}

export interface PhonePriceTrend {
  month: string;
  newPrice: number;
  usedPrice: number;
  resaleValue: number;
}

export interface PhoneFilterParams {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  ram?: string;
  storage?: string;
  fiveG?: boolean;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "rating" | "latest";
}

// ------------------------------------
// Resale Types
// ------------------------------------

export type PhoneCondition = "like_new" | "good" | "fair" | "poor";

export interface ResalePredictionRequest {
  brand: string;
  model: string;
  variant: string;
  ram: string;
  storage: string;
  purchaseYear: number;
  condition: PhoneCondition;
  batteryHealth: number;       // percentage 0–100
  screenCondition: "pristine" | "minor_scratches" | "cracked";
  hasRepairHistory: boolean;
  hasWarranty: boolean;
  hasOriginalBox: boolean;
  hasOriginalCharger: boolean;
}

export interface ResaleDepreciationPoint {
  period: string;
  estimatedValue: number;
}

export interface ResaleFeatureImpact {
  feature: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
  percentageImpact: number;
}

export interface ResalePredictionResult {
  id: string;
  predictedValue: number;          // INR
  currency: "INR";
  confidenceScore: number;         // 0–1
  priceRange: { min: number; max: number };
  depreciationForecast: ResaleDepreciationPoint[];
  featureImpacts: ResaleFeatureImpact[];
  sellingTips: string[];
  createdAt: string;
}

export interface SellPhoneVariant {
  label: string;
  storage: string;
  originalPrice: number;
}

export interface SellPhoneModel {
  name: string;
  variants: SellPhoneVariant[];
}

export interface SellPhoneBrand {
  brand: string;
  models: SellPhoneModel[];
}

export interface SellPhoneFormData {
  brand: string;
  model: string;
  variant: string;
  usageDurationYears: string;
  batteryHealth: number;
  warranty: "yes" | "no" | "";
  condition: PhoneCondition | "";
  screenCracks: boolean | null;
  majorScratches: boolean | null;
  previousRepair: boolean | null;
  originalBox: boolean | null;
  originalCharger: boolean | null;
}

export interface ResaleModelRequest {
  launch_price_inr: number;
  launch_year: number;
  age_years: number;
  ram_gb: number;
  storage_gb: number;
  display_hz: number;
  battery_health_pct: number;
  camera_mp: number;
  brand: string;
  model: string;
  processor: string;
  condition: string;
  screen_crack: string;
  scratches: string;
  box: string;
  charger: string;
  invoice: string;
  warranty: string;
  network: string;
  repair_history: string;
  seller_type: string;
}

export interface ResaleModelResponse {
  estimated_resale_price_inr: number;
  display_price_inr: number;
  currency: "INR";
  model_version: string;
}

export interface ResaleValueFactor {
  name: string;
  impact: "positive" | "negative" | "neutral";
  explanation: string;
}

export interface MockResalePrediction {
  id: string;
  estimatedValue: number;
  range: { min: number; max: number };
  breakdown: ResaleValueFactor[];
  generatedAt: string;
  isDemo: true;
}

export interface SellPhoneResultPayload {
  form: SellPhoneFormData;
  prediction: MockResalePrediction;
}

// ------------------------------------
// Recommendation Types
// ------------------------------------

export type RecommendationUsage =
  | "gaming"
  | "photography"
  | "study"
  | "work"
  | "entertainment"
  | "general";

export type RecommendationPriorityFactor =
  | "performance"
  | "battery"
  | "camera"
  | "display"
  | "storage"
  | "value";

export type RecommendationPriority = "high" | "medium" | "low";
export type RecommendationPhoneType = "new" | "refurbished" | "either";

export interface RecommendationPreferences {
  budgetMin: number;
  budgetMax: number;
  phoneType: RecommendationPhoneType;
  usage: RecommendationUsage[];
  minRam: number;
  minStorage: number;
  fiveG: "required" | "preferred" | "not-important";
  battery: RecommendationPriority | "no-preference";
  display: RecommendationPriority | "no-preference";
  camera: RecommendationPriority | "no-preference";
  performance: RecommendationPriority | "very-high" | "no-preference";
  priorities: Record<RecommendationPriorityFactor, RecommendationPriority>;
}

export type RecommendationFeatureLevel = RecommendationPriority | "no-preference";

export interface RecommendedMatch {
  phone: Phone;
  matchScore: number;            // 0–100
  matchedReasons: string[];
  tradeoffs: string[];
  tag: "Best Overall" | "Best Value" | "Best Camera" | "Best Battery" | "Top Pick";
}

export interface RecommendationMetrics {
  performance: number;
  battery: number;
  camera: number;
}

export type RecommendationApiPriorityFactor =
  | "performance"
  | "battery"
  | "ram"
  | "storage"
  | "display"
  | "price"
  | "rating"
  | "refresh_rate"
  | "camera";

export interface RecommendationApiRequest {
  budget_min: number;
  budget_max: number;
  usage: RecommendationUsage[];
  min_ram_gb: number;
  min_storage_gb: number;
  requires_5g: boolean;
  min_battery_mah?: number;
  preferred_display_min?: number;
  preferred_display_max?: number;
  priorities: Record<RecommendationApiPriorityFactor, number>;
}

export interface RecommendationApiSpecifications {
  ram_gb: number | null;
  storage_gb: number | null;
  battery_mah: number | null;
  processor_speed_ghz: number | null;
  display_size_inches: number | null;
  refresh_rate_hz: number | null;
  has_5g: boolean | null;
}

export interface RecommendationApiItem {
  id: string;
  mobile_name: string;
  brand: string;
  price: number;
  ratings: number;
  match_score: number;
  specifications: RecommendationApiSpecifications;
  why_it_matches: string[];
  tradeoffs: string[];
  image_url: string | null;
}

export type RecommendationEngineItem = Omit<RecommendationApiItem, "id">;

export interface RecommendationApiResponse {
  recommendations: RecommendationEngineItem[];
}

export interface RankedPhoneRecommendation {
  phone: Phone;
  matchScore: number;
  metrics?: RecommendationMetrics;
  matchedReasons: string[];
  tradeoffs: string[];
  apiRecommendation?: RecommendationApiItem;
}

export interface RecommendationExplanation {
  reasons: string[];
  tradeoffs: string[];
}

export interface RecommendationResult {
  sessionId: string;
  preferences: RecommendationPreferences;
  results: RankedPhoneRecommendation[];
  generatedAt: string;
  isDemo: boolean;
}

// ------------------------------------
// User Types
// ------------------------------------

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: "free" | "premium";
  budgetRange: { min: number; max: number };
  primaryUsage: string;
  preferredBrands: string[];
  keyFeatures: string[];
  savedPhoneIds: string[];
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: "resale_prediction" | "recommendation" | "comparison" | "saved_phone";
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

// Price Insight Types
// ------------------------------------

export interface BrandInsight {
  brand: string;
  oneYearDepreciation: number;   // % loss
  resaleRetention: number;       // % retained
  topSegment: string;
}

export interface MarketPriceTrend {
  month: string;
  newPrice: number;
  usedPrice: number;
  resaleValue: number;
}
