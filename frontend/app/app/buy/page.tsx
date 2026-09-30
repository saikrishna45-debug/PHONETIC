import Link from "next/link";
import { ArrowLeft, SearchCheck } from "lucide-react";
import { RecommendationFlow } from "@/components/buy/recommendation-flow";
import { DEFAULT_RECOMMENDATION_PREFERENCES } from "@/data/recommendations";
import { parseRecommendationPreferences } from "@/lib/api/recommendations";

interface BuyPageProps {
  searchParams: Promise<{ preferences?: string | string[] }>;
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const params = await searchParams;
  const serializedPreferences = Array.isArray(params.preferences) ? params.preferences[0] : params.preferences;
  const initialPreferences = serializedPreferences
    ? parseRecommendationPreferences(serializedPreferences)
    : DEFAULT_RECOMMENDATION_PREFERENCES;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link href="/app/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowLeft className="h-4 w-4" />Back to Dashboard</Link>
      <header className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><SearchCheck className="h-5 w-5" /></span>
        <div>
          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Find My Phone</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">Tell us what matters to you and we&apos;ll find smartphones that fit.</p>
        </div>
      </header>
      <RecommendationFlow initialPreferences={initialPreferences} />
    </div>
  );
}
