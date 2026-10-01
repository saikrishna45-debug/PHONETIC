import { CompareWorkspace } from "@/components/compare/compare-workspace";
import { parseRecommendationApiResponse, parseRecommendationPreferences, recommendationToPhone } from "@/lib/api/recommendations";

interface ComparePageProps {
  searchParams: Promise<{ phones?: string | string[]; preferences?: string | string[]; recommendations?: string | string[] }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const serializedPhones = Array.isArray(params.phones) ? params.phones[0] : params.phones;
  const serializedPreferences = Array.isArray(params.preferences) ? params.preferences[0] : params.preferences;
  const serializedRecommendations = Array.isArray(params.recommendations) ? params.recommendations[0] : params.recommendations;
  const initialPhoneIds = serializedPhones?.split(",").filter(Boolean) ?? [];
  const preferences = serializedPreferences ? parseRecommendationPreferences(serializedPreferences) : null;
  const recommendationResponse = parseRecommendationApiResponse(serializedRecommendations);
  const recommendationPhones = recommendationResponse?.recommendations.map(item => ({
    ...item,
    id: `recommendation-${`${item.brand}-${item.mobile_name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  })).map(item => recommendationToPhone(item)) ?? [];

  return <CompareWorkspace initialPhoneIds={initialPhoneIds} initialRecommendationPhones={recommendationPhones} preferences={preferences} />;
}
