import { DEFAULT_RECOMMENDATION_PREFERENCES } from "@/data/recommendations";
import { ApiError, apiClient } from "@/lib/api/client";
import { APP_CONFIG } from "@/lib/constants";
import type {
  Phone,
  RecommendationApiItem,
  RecommendationEngineItem,
  RecommendationApiRequest,
  RecommendationApiResponse,
  RecommendationExplanation,
  RecommendationPreferences,
  RecommendationPriorityFactor,
  RecommendationResult,
  RankedPhoneRecommendation,
} from "@/types/index";

const RECOMMENDATION_CACHE_KEY = "phonetic-recommendation-snapshots";
const priorityWeight = { high: 5, medium: 3, low: 1 } as const;
const requirementWeight = { "no-preference": 0, low: 1, medium: 3, high: 5, "very-high": 5 } as const;

export function parseRecommendationPreferences(value?: string): RecommendationPreferences {
  if (!value) return DEFAULT_RECOMMENDATION_PREFERENCES;
  try {
    const parsed = JSON.parse(value) as Partial<RecommendationPreferences>;
    const parsedMin = Number(parsed.budgetMin);
    const parsedMax = Number(parsed.budgetMax);
    const budgetMin = Number.isFinite(parsedMin) ? Math.max(0, parsedMin) : DEFAULT_RECOMMENDATION_PREFERENCES.budgetMin;
    const budgetMax = Number.isFinite(parsedMax) ? Math.max(budgetMin, parsedMax) : DEFAULT_RECOMMENDATION_PREFERENCES.budgetMax;
    const allowedUsage = ["gaming", "photography", "study", "work", "entertainment", "general"];
    const usage = Array.isArray(parsed.usage) ? parsed.usage.filter(item => allowedUsage.includes(item)) : [];
    const allowedPriority = (value: unknown): value is "high" | "medium" | "low" => value === "high" || value === "medium" || value === "low";
    const incomingPriorities = parsed.priorities ?? {} as RecommendationPreferences["priorities"];
    const priorityFactors: RecommendationPriorityFactor[] = ["performance", "battery", "camera", "display", "storage", "value"];
    const priorities = { ...DEFAULT_RECOMMENDATION_PREFERENCES.priorities };
    for (const factor of priorityFactors) if (allowedPriority(incomingPriorities[factor])) priorities[factor] = incomingPriorities[factor];
    const featureLevels = ["no-preference", "low", "medium", "high"];
    const performanceLevels = [...featureLevels, "very-high"];

    return {
      budgetMin,
      budgetMax,
      phoneType: parsed.phoneType === "new" || parsed.phoneType === "refurbished" ? parsed.phoneType : "either",
      usage: usage as RecommendationPreferences["usage"],
      minRam: Number(parsed.minRam) > 0 ? Number(parsed.minRam) : DEFAULT_RECOMMENDATION_PREFERENCES.minRam,
      minStorage: Number(parsed.minStorage) > 0 ? Number(parsed.minStorage) : DEFAULT_RECOMMENDATION_PREFERENCES.minStorage,
      fiveG: parsed.fiveG === "required" || parsed.fiveG === "not-important" ? parsed.fiveG : "preferred",
      battery: featureLevels.includes(parsed.battery ?? "") ? parsed.battery! as RecommendationPreferences["battery"] : "no-preference",
      display: featureLevels.includes(parsed.display ?? "") ? parsed.display! as RecommendationPreferences["display"] : "no-preference",
      camera: featureLevels.includes(parsed.camera ?? "") ? parsed.camera! as RecommendationPreferences["camera"] : "no-preference",
      performance: performanceLevels.includes(parsed.performance ?? "") ? parsed.performance! as RecommendationPreferences["performance"] : "no-preference",
      priorities,
    };
  } catch {
    return DEFAULT_RECOMMENDATION_PREFERENCES;
  }
}

export function explainPhoneMatch(phone: Phone, preferences: RecommendationPreferences): RecommendationExplanation {
  const profile = phone.recommendationProfile;
  const reasons: string[] = [];
  const tradeoffs: string[] = [];

  const usageReasons: Record<string, string> = {
    gaming: "Strong performance for gaming.",
    photography: "Camera system aligns with your photography preference.",
    study: "A balanced fit for study and everyday tasks.",
    work: "Memory and performance suit productivity and multitasking.",
    entertainment: "Display and battery suit media and entertainment.",
    general: "A balanced option for general everyday use.",
  };
  for (const usage of preferences.usage) if (profile?.usageTags.includes(usage)) reasons.push(usageReasons[usage]);

  if (phone.price >= preferences.budgetMin && phone.price <= preferences.budgetMax) reasons.push("Fits your selected budget range.");
  else if (phone.price < preferences.budgetMin) reasons.push("Priced below your minimum budget, leaving room to save.");
  else tradeoffs.push("Price is above your selected budget range.");
  if (profile && profile.ramGb >= preferences.minRam) reasons.push(`Meets your ${preferences.minRam} GB RAM minimum.`);
  else if (profile) tradeoffs.push(`RAM is below your ${preferences.minRam} GB minimum.`);
  if (profile && profile.storageGb >= preferences.minStorage) reasons.push(`Meets your ${preferences.minStorage} GB storage minimum.`);
  else if (profile) tradeoffs.push(`Storage is below your ${preferences.minStorage} GB minimum.`);
  if (preferences.fiveG === "required" && phone.fiveG) reasons.push("Supports the 5G requirement you selected.");
  if (preferences.fiveG === "required" && !phone.fiveG) tradeoffs.push("Does not meet your 5G requirement.");

  if (profile) {
    if (profile.batteryScore >= 9) reasons.push("High battery capacity is one of its strengths.");
    else if (preferences.battery === "high") tradeoffs.push("Battery capability is more moderate than your preference.");
    if (profile.cameraScore <= 6 && preferences.usage.includes("photography")) tradeoffs.push("Camera capability is not its strongest area.");
    if (profile.performanceScore <= 6 && preferences.usage.includes("gaming")) tradeoffs.push("Performance may be limited for demanding games.");
    if (profile.displayScore >= 9 && preferences.display !== "no-preference") reasons.push("Display capability aligns with your preference.");
  }

  if (!tradeoffs.length && phone.cons[0]) tradeoffs.push(phone.cons[0]);

  return { reasons: [...new Set(reasons)].slice(0, 5), tradeoffs: [...new Set(tradeoffs)].slice(0, 3) };
}

export class RecommendationApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "RecommendationApiError";
  }
}

function priorityToWeight(priority: "high" | "medium" | "low"): number {
  return priorityWeight[priority];
}

function preferenceToWeight(level: string): number {
  return requirementWeight[level as keyof typeof requirementWeight] ?? 0;
}

function combinedWeight(priority: "high" | "medium" | "low", level: string): number {
  return Math.max(priorityToWeight(priority), preferenceToWeight(level));
}

export function toRecommendationApiRequest(preferences: RecommendationPreferences): RecommendationApiRequest {
  return {
    budget_min: preferences.budgetMin,
    budget_max: preferences.budgetMax,
    usage: preferences.usage.length ? preferences.usage : ["general"],
    min_ram_gb: preferences.minRam,
    min_storage_gb: preferences.minStorage,
    requires_5g: preferences.fiveG === "required",
    priorities: {
      performance: combinedWeight(preferences.priorities.performance, preferences.performance),
      battery: combinedWeight(preferences.priorities.battery, preferences.battery),
      ram: 0,
      storage: priorityToWeight(preferences.priorities.storage),
      display: combinedWeight(preferences.priorities.display, preferences.display),
      price: priorityToWeight(preferences.priorities.value),
      rating: 0,
      refresh_rate: 0,
      camera: combinedWeight(preferences.priorities.camera, preferences.camera),
    },
  };
}

function apiRootUrl(): string {
  return APP_CONFIG.apiBaseUrl.replace(/\/api\/v1\/?$/, "");
}

export function recommendationIdFor(item: RecommendationEngineItem): string {
  const slug = `${item.brand}-${item.mobile_name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `recommendation-${slug}`;
}

function formatCapacity(value: number | null, unit: string): string {
  if (value === null) return "Not provided";
  if (unit === "GB" && value >= 1024) return `${value / 1024} TB`;
  return `${value}${unit}`;
}

export function recommendationToPhone(item: RecommendationApiItem): Phone {
  const specifications = item.specifications;
  const ram = formatCapacity(specifications.ram_gb, "GB");
  const storage = formatCapacity(specifications.storage_gb, "GB");

  return {
    id: item.id,
    brand: item.brand,
    model: item.mobile_name,
    variant: `${ram} / ${storage}`,
    price: item.price,
    launchPrice: 0,
    currentPrice: item.price,
    ram,
    storage,
    processor: specifications.processor_speed_ghz === null ? "Not provided" : `${specifications.processor_speed_ghz} GHz performance signal`,
    battery: formatCapacity(specifications.battery_mah, " mAh"),
    camera: "Not provided by the recommendation response",
    display: specifications.display_size_inches === null ? "Not provided" : `${specifications.display_size_inches} inch display`,
    refreshRate: formatCapacity(specifications.refresh_rate_hz, "Hz"),
    operatingSystem: "Not provided by the recommendation response",
    fiveG: specifications.has_5g === true,
    launchYear: 0,
    rating: item.ratings,
    image: item.image_url ?? "",
    pros: item.why_it_matches,
    cons: item.tradeoffs,
    highlights: [],
  };
}

export function toRecommendationResult(
  response: RecommendationApiResponse,
  preferences: RecommendationPreferences,
): RecommendationResult {
  const results: RankedPhoneRecommendation[] = response.recommendations.map(engineItem => {
    const apiRecommendation: RecommendationApiItem = {
      ...engineItem,
      id: recommendationIdFor(engineItem),
    };

    return {
      phone: recommendationToPhone(apiRecommendation),
      matchScore: apiRecommendation.match_score,
      matchedReasons: apiRecommendation.why_it_matches,
      tradeoffs: apiRecommendation.tradeoffs,
      apiRecommendation,
    };
  });

  return {
    sessionId: `recommendations-${Date.now()}`,
    preferences,
    results,
    generatedAt: new Date().toISOString(),
    isDemo: false,
  };
}

export function parseRecommendationApiResponse(value?: string): RecommendationApiResponse | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as { recommendations?: unknown }).recommendations)) return null;
    const recommendations = (parsed as { recommendations: unknown[] }).recommendations;
    const valid = recommendations.every((item): item is RecommendationEngineItem => {
      if (!item || typeof item !== "object") return false;
      const record = item as Record<string, unknown>;
      const specs = record.specifications;
      if (!specs || typeof specs !== "object") return false;
      return typeof record.mobile_name === "string"
        && typeof record.brand === "string"
        && typeof record.price === "number"
        && typeof record.ratings === "number"
        && typeof record.match_score === "number"
        && Array.isArray(record.why_it_matches)
        && record.why_it_matches.every(reason => typeof reason === "string")
        && Array.isArray(record.tradeoffs)
        && record.tradeoffs.every(tradeoff => typeof tradeoff === "string")
        && (record.image_url === null || typeof record.image_url === "string");
    });
    return valid ? { recommendations } : null;
  } catch {
    return null;
  }
}

export function parseRecommendationApiItem(value?: string): RecommendationApiItem | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const response = parseRecommendationApiResponse(JSON.stringify({ recommendations: [parsed] }));
    const item = response?.recommendations[0];
    if (!item) return null;
    return {
      ...item,
      id: typeof parsed.id === "string" ? parsed.id : recommendationIdFor(item),
    };
  } catch {
    return null;
  }
}

export function cacheRecommendationSnapshots(items: RecommendationApiItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readRecommendationSnapshots();
    const byId = new Map(existing.map(item => [item.id, item]));
    for (const item of items) byId.set(item.id, item);
    window.localStorage.setItem(RECOMMENDATION_CACHE_KEY, JSON.stringify([...byId.values()].slice(-100)));
  } catch {
    // Recommendation submission must succeed even if optional local caching is unavailable.
  }
}

export function readRecommendationSnapshots(): RecommendationApiItem[] {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(RECOMMENDATION_CACHE_KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as RecommendationApiItem[] : [];
  } catch {
    return [];
  }
}

export function getRecommendationSnapshot(id: string): RecommendationApiItem | undefined {
  return readRecommendationSnapshots().find(item => item.id === id);
}

export async function getRecommendations(
  preferences: RecommendationPreferences,
  topK = 5,
): Promise<RecommendationApiItem[]> {
  let response: RecommendationApiResponse;
  try {
    response = await apiClient<RecommendationApiResponse>("/api/recommendations", {
      baseUrl: apiRootUrl(),
      params: { top_k: topK },
      method: "POST",
      body: JSON.stringify(toRecommendationApiRequest(preferences)),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 422) throw new RecommendationApiError("Some preferences were not accepted. Review your selections and try again.", error.status);
      if (error.status === 503) throw new RecommendationApiError("Recommendations are temporarily unavailable. Please try again shortly.", error.status);
      if (error.status >= 500) throw new RecommendationApiError("We could not generate recommendations right now. Please try again.", error.status);
      throw new RecommendationApiError("The recommendation request could not be completed. Please try again.", error.status);
    }
    if (error instanceof TypeError) throw new RecommendationApiError("Cannot reach the recommendation service. Check that the backend is running and try again.");
    throw new RecommendationApiError("We could not generate recommendations right now. Please try again.");
  }

  const recommendations = response.recommendations.map(item => ({ ...item, id: recommendationIdFor(item) }));
  cacheRecommendationSnapshots(recommendations);
  return recommendations;
}
