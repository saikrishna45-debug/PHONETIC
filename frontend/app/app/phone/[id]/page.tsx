import { notFound } from "next/navigation";
import { MOCK_PHONES } from "@/data/phones";
import { explainPhoneMatch, parseRecommendationPreferences } from "@/lib/api/recommendations";
import { PhoneDetailView } from "@/components/phones/phone-detail-view";
import type { RecommendationExplanation } from "@/types/recommendation";

interface PhoneDetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preferences?: string | string[]; matchScore?: string | string[] }>;
}

export default async function PhoneDetailsPage({ params, searchParams }: PhoneDetailsPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const phone = MOCK_PHONES.find(item => item.id === id);
  if (!phone) notFound();

  const serialized = Array.isArray(query.preferences) ? query.preferences[0] : query.preferences;
  const matchScoreValue = Array.isArray(query.matchScore) ? query.matchScore[0] : query.matchScore;
  const parsedMatchScore = Number(matchScoreValue);
  const preferences = serialized ? parseRecommendationPreferences(serialized) : null;
  const explanation: RecommendationExplanation = preferences
    ? explainPhoneMatch(phone, preferences)
    : {
        reasons: [
          `${phone.recommendationProfile?.ramGb ?? phone.ram} RAM and ${phone.recommendationProfile?.storageGb ?? phone.storage} storage.`,
          phone.fiveG ? "Supports 5G connectivity." : "Balanced specifications for everyday use.",
          ...(phone.recommendationProfile?.batteryScore && phone.recommendationProfile.batteryScore >= 9 ? ["High-capacity battery is a standout specification."] : []),
        ],
        tradeoffs: phone.cons.slice(0, 2),
      };

  return <PhoneDetailView phone={phone} preferences={preferences} explanation={explanation} matchScore={Number.isFinite(parsedMatchScore) ? parsedMatchScore : null} hasPreferences={Boolean(serialized)} />;
}
