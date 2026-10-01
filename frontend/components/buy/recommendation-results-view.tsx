"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PencilLine, Sparkles } from "lucide-react";
import type { RecommendationPreferences, RecommendationResult } from "@/types/recommendation";
import { RecommendationCard } from "@/components/buy/recommendation-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatINR } from "@/lib/utils";

const usageNames: Record<string, string> = {
  gaming: "Gaming",
  photography: "Photography",
  study: "Study",
  work: "Work",
  entertainment: "Entertainment",
  general: "General Use",
};

export function RecommendationResultsView({ result, preferences }: { result: RecommendationResult | null; preferences: RecommendationPreferences }) {
  const router = useRouter();
  const serialized = encodeURIComponent(JSON.stringify(preferences));
  const results = result?.results ?? [];
  const recommendationsQuery = encodeURIComponent(JSON.stringify({
    recommendations: results.flatMap(match => match.apiRecommendation ? [match.apiRecommendation] : []),
  }));

  if (!result) {
    return <EmptyState title="Recommendations unavailable" description="Start the Find My Phone flow to request current recommendations." action={{ label: "Find My Phone", onClick: () => router.push(`/app/buy?preferences=${serialized}`) }} />;
  }

  if (!results.length) {
    return <EmptyState title="No phones match these preferences" description="Adjust your budget or requirements and search again." action={{ label: "Edit Preferences", onClick: () => router.push(`/app/buy?preferences=${serialized}`) }} />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/app/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowLeft className="h-4 w-4" />Back to Dashboard</Link>
        <Badge variant="secondary" className="gap-1.5"><Sparkles className="h-3.5 w-3.5 text-emerald-700" />PHONETIC recommendations</Badge>
      </div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Phonetic Recommendations</h1>
          <p className="mt-1 text-sm text-slate-600">Based on your budget and preferences</p>
        </div>
        <Link href={`/app/buy?preferences=${serialized}`} className="inline-flex min-h-10 w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><PencilLine className="h-4 w-4" />Edit Preferences</Link>
      </header>

      <Card className="border-slate-200 shadow-none">
        <CardContent className="flex flex-wrap gap-x-6 gap-y-3 p-4 sm:p-5">
          <PreferenceSummary label="Budget" value={`${formatINR(preferences.budgetMin)}–${formatINR(preferences.budgetMax)}`} />
          <PreferenceSummary label="Usage" value={preferences.usage.map(item => usageNames[item]).join(", ") || "Balanced use"} />
          <PreferenceSummary label="Minimum RAM" value={`${preferences.minRam} GB`} />
          <PreferenceSummary label="Storage" value={`${preferences.minStorage >= 1024 ? `${preferences.minStorage / 1024} TB` : `${preferences.minStorage} GB`} minimum`} />
        </CardContent>
      </Card>

      <div><h2 className="text-lg font-bold text-slate-950">Top matches</h2><p className="mt-1 text-xs text-slate-500">{results.length} phones ranked by the PHONETIC recommendation engine.</p></div>
      <div className="space-y-4">{results.map((match, index) => <RecommendationCard key={match.phone.id} match={match} rank={index + 1} preferences={preferences} recommendationsQuery={recommendationsQuery} />)}</div>
      <p className="text-xs leading-5 text-slate-500">Scores, match notes, and trade-offs are returned by the PHONETIC recommendation service.</p>
    </div>
  );
}

function PreferenceSummary({ label, value }: { label: string; value: string }) {
  return <div className="min-w-[7rem]"><p className="text-[10px] font-semibold uppercase text-slate-400">{label}</p><p className="mt-1 text-xs font-semibold text-slate-800">{value}</p></div>;
}
