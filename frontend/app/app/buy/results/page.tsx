import { RecommendationResultsView } from "@/components/buy/recommendation-results-view";
import { getRecommendations, parseRecommendationPreferences } from "@/lib/api/recommendations";

interface RecommendationResultsPageProps {
  searchParams: Promise<{ preferences?: string | string[] }>;
}

export default async function RecommendationResultsPage({ searchParams }: RecommendationResultsPageProps) {
  const params = await searchParams;
  const serialized = Array.isArray(params.preferences) ? params.preferences[0] : params.preferences;
  const preferences = parseRecommendationPreferences(serialized);
  let result = null;
  try {
    result = await getRecommendations(preferences);
  } catch {
    result = null;
  }
  return <RecommendationResultsView result={result} preferences={preferences} />;
}
