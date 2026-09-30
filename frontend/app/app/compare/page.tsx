import { CompareWorkspace } from "@/components/compare/compare-workspace";
import { parseRecommendationPreferences } from "@/lib/api/recommendations";

interface ComparePageProps {
  searchParams: Promise<{ phones?: string | string[]; preferences?: string | string[] }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const serializedPhones = Array.isArray(params.phones) ? params.phones[0] : params.phones;
  const serializedPreferences = Array.isArray(params.preferences) ? params.preferences[0] : params.preferences;
  const initialPhoneIds = serializedPhones?.split(",").filter(Boolean) ?? [];
  const preferences = serializedPreferences ? parseRecommendationPreferences(serializedPreferences) : null;

  return <CompareWorkspace initialPhoneIds={initialPhoneIds} preferences={preferences} />;
}
