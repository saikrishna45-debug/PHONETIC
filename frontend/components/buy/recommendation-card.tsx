"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, BookmarkCheck, GitCompareArrows } from "lucide-react";
import type { RankedPhoneRecommendation, RecommendationPreferences } from "@/types/recommendation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { PhoneImage } from "@/components/phones/phone-image";
import { MatchIndicator } from "@/components/buy/match-indicator";
import { getInitialSavedPhoneIds, readSavedPhoneIds, removeSavedPhoneId, savePhoneId, subscribeSavedPhoneIds } from "@/lib/saved-phones";

export function RecommendationCard({ match, rank, preferences }: { match: RankedPhoneRecommendation; rank: number; preferences: RecommendationPreferences }) {
  const { phone } = match;
  const preferenceQuery = encodeURIComponent(JSON.stringify(preferences));
  const profile = phone.recommendationProfile;
  const savedIds = useSyncExternalStore(subscribeSavedPhoneIds, readSavedPhoneIds, getInitialSavedPhoneIds);
  const isSaved = savedIds.includes(phone.id);

  function toggleSaved() {
    if (isSaved) removeSavedPhoneId(phone.id);
    else savePhoneId(phone.id);
  }

  return (
    <Card className={`overflow-hidden ${rank === 1 ? "border-emerald-200 shadow-sm" : "border-slate-200"}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5">
          <PhoneImage model={phone.model} className="aspect-[4/3] rounded-xl sm:aspect-square" priority={rank === 1} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={rank === 1 ? "success" : "secondary"}>#{rank}</Badge>
                <span className="text-xs font-medium text-slate-500">{phone.brand}</span>
              </div>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">{match.matchScore}% Match</span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h2 className="text-lg font-bold text-slate-950">{phone.model}</h2>
              <p className="text-base font-bold text-slate-900">{formatINR(phone.price)}</p>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{phone.variant} · {phone.refreshRate}</p>
            <div className="mt-4 space-y-2.5">
              <MatchIndicator label="Performance" value={match.metrics.performance} />
              <MatchIndicator label="Battery" value={match.metrics.battery} />
              <MatchIndicator label="Camera" value={match.metrics.camera} />
            </div>
            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold text-emerald-800">Why it fits</p>
                <ul className="mt-1 space-y-1 text-xs leading-5 text-slate-600">
                  {(match.matchedReasons.length ? match.matchedReasons.slice(0, 2) : ["Balanced match for the preferences you selected."]).map(reason => <li key={reason}>✓ {reason}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-amber-800">Potential trade-offs</p>
                <ul className="mt-1 space-y-1 text-xs leading-5 text-slate-600">
                  {(match.tradeoffs.length ? match.tradeoffs.slice(0, 2) : [profile && profile.cameraScore < 8 ? "Camera is not its strongest area." : "No standout trade-off in this demo profile."]).map(tradeoff => <li key={tradeoff}>• {tradeoff}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 lg:flex-row">
              <Button asChild className="min-h-10 w-full lg:w-auto"><Link href={`/app/phone/${phone.id}?preferences=${preferenceQuery}&matchScore=${match.matchScore}`}>View Details<ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" className="min-h-10 w-full lg:w-auto"><Link href={`/app/compare?phones=${encodeURIComponent(phone.id)}&preferences=${preferenceQuery}`}><GitCompareArrows className="h-4 w-4" />Compare</Link></Button>
              <Button type="button" variant="ghost" aria-label={isSaved ? "Remove saved phone" : "Save phone"} aria-pressed={isSaved} onClick={toggleSaved} className="min-h-10 w-full lg:w-auto">{isSaved ? <BookmarkCheck className="h-4 w-4 text-emerald-700" /> : <Bookmark className="h-4 w-4" />}{isSaved ? "Saved" : "Save Phone"}</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
