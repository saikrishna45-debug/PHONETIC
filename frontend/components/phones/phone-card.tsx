import React from "react";
import Link from "next/link";
import type { Phone } from "@/types/index";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, calcDepreciation } from "@/lib/utils";
import { Star, Bookmark, ArrowRight, GitCompareArrows, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneImage } from "@/components/phones/phone-image";
import type { RecommendationApiItem } from "@/types/recommendation";

interface PhoneCardProps {
  phone: Phone;
  onSave?: (id: string) => void;
  isSaved?: boolean;
  matchScore?: number;
  showImage?: boolean;
  showCompare?: boolean;
  priority?: boolean;
  recommendation?: RecommendationApiItem;
  recommendations?: RecommendationApiItem[];
}

export function PhoneCard({ phone, onSave, isSaved, matchScore, showImage = false, showCompare = false, priority = false, recommendation, recommendations = [] }: PhoneCardProps) {
  const depreciation = calcDepreciation(phone.launchPrice, phone.price);
  const recommendationSet = recommendations.length ? recommendations : recommendation ? [recommendation] : [];
  const serializedResult = recommendationSet.length
    ? `&recommendations=${encodeURIComponent(JSON.stringify({ recommendations: recommendationSet }))}`
    : "";
  const serializedRecommendation = recommendation
    ? `&recommendation=${encodeURIComponent(JSON.stringify(recommendation))}&matchScore=${recommendation.match_score}`
    : "";

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      {showImage && <PhoneImage model={phone.model} imageUrl={phone.image.startsWith("https://") ? phone.image : undefined} className="aspect-[16/8] rounded-t-2xl" priority={priority} />}
      <CardContent className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-semibold">
              {phone.brand}
            </Badge>
            {phone.fiveG && (
              <Badge variant="success" className="text-xs gap-1">
                <Wifi className="h-2.5 w-2.5" />
                5G
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {matchScore !== undefined && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {matchScore}% match
              </span>
            )}
            {onSave && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onSave(phone.id); }}
                aria-pressed={Boolean(isSaved)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                aria-label={isSaved ? "Unsave phone" : "Save phone"}
              >
                <Bookmark
                  className={`h-4 w-4 ${isSaved ? "fill-emerald-500 text-emerald-500" : ""}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Phone name */}
        <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors line-clamp-1">
          {phone.model}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{phone.variant}</p>

        {/* Key specs as pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md font-medium">
            {phone.ram} RAM
          </span>
          <span className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md font-medium">
            {phone.storage}
          </span>
          <span className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md font-medium">
            {phone.refreshRate}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-3">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-slate-700">{phone.rating}</span>
        </div>

        {/* Price row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-slate-900">{formatINR(phone.price)}</p>
            {depreciation > 0 && (
              <p className="text-[11px] text-slate-400">
                <span className="text-red-500 font-medium">-{depreciation}%</span> from launch
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showCompare && <Button asChild variant="ghost" size="sm" className="text-xs gap-1"><Link href={`/app/compare?phones=${encodeURIComponent(phone.id)}${serializedRecommendation}${serializedResult}`}><GitCompareArrows className="h-3 w-3" />Compare</Link></Button>}
            <Button asChild variant="outline" size="sm" className="text-xs gap-1"><Link href={`/app/phone/${encodeURIComponent(phone.id)}${recommendation ? `?recommendation=${encodeURIComponent(JSON.stringify(recommendation))}&matchScore=${recommendation.match_score}${serializedResult}` : ""}`}><span>View</span><ArrowRight className="h-3 w-3" /></Link></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
