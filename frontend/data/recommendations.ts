import type { RecommendationPreferences } from "@/types/recommendation";

export const DEFAULT_RECOMMENDATION_PREFERENCES: RecommendationPreferences = {
	budgetMin: 20000,
	budgetMax: 50000,
	phoneType: "either",
	usage: [],
	minRam: 8,
	minStorage: 128,
	fiveG: "preferred",
	battery: "no-preference",
	display: "no-preference",
	camera: "no-preference",
	performance: "no-preference",
	priorities: {
		performance: "high",
		battery: "medium",
		camera: "medium",
		display: "medium",
		storage: "low",
		value: "high",
	},
};

// Retained as a compatibility export for any earlier prototype consumers.
export { MOCK_RECOMMENDATIONS as MOCK_RECOMMENDATION_MATCHES } from "./index";
