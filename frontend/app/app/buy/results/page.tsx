import { RecommendationResultsView } from "@/components/buy/recommendation-results-view";
import { parseRecommendationApiResponse, parseRecommendationPreferences, toRecommendationResult } from "@/lib/api/recommendations";

interface RecommendationResultsPageProps {
  searchParams: Promise<{ preferences?: string | string[]; recommendations?: string | string[] }>;
}

export default async function RecommendationResultsPage({ searchParams }: RecommendationResultsPageProps) {
  const params = await searchParams;
  const serializedPreferences = Array.isArray(params.preferences) ? params.preferences[0] : params.preferences;
  const serializedRecommendations = Array.isArray(params.recommendations) ? params.recommendations[0] : params.recommendations;
  const preferences = parseRecommendationPreferences(serializedPreferences);
  const apiResponse = parseRecommendationApiResponse(serializedRecommendations);
  const result = apiResponse ? toRecommendationResult(apiResponse, preferences) : null;
  return <RecommendationResultsView result={result} preferences={preferences} />;
}
