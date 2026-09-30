"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, GitCompareArrows, Heart, ShieldCheck, Smartphone, X } from "lucide-react";
import type { Phone, RecommendationExplanation, RecommendationPreferences } from "@/types/index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneImage } from "@/components/phones/phone-image";
import { formatINR } from "@/lib/utils";
import { getInitialSavedPhoneIds, readSavedPhoneIds, removeSavedPhoneId, savePhoneId, subscribeSavedPhoneIds } from "@/lib/saved-phones";

export function PhoneDetailView({ phone, preferences, explanation, matchScore, hasPreferences }: { phone: Phone; preferences: RecommendationPreferences | null; explanation: RecommendationExplanation; matchScore: number | null; hasPreferences: boolean }) {
  const [saveStatus, setSaveStatus] = useState("");
  const savedIds = useSyncExternalStore(subscribeSavedPhoneIds, readSavedPhoneIds, getInitialSavedPhoneIds);
  const saved = savedIds.includes(phone.id);
  const preferenceQuery = preferences ? encodeURIComponent(JSON.stringify(preferences)) : "";
  const profile = phone.recommendationProfile;
  const specs = [
    ["RAM", phone.ram],
    ["Storage", phone.storage],
    ["Processor", phone.processor],
    ["Battery", phone.battery],
    ["Camera", phone.camera],
    ["Display", phone.display],
    ["Refresh rate", phone.refreshRate],
    ["5G", phone.fiveG ? "Supported" : "Not supported"],
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
      <Link href={hasPreferences ? `/app/buy/results?preferences=${preferenceQuery}` : "/app/buy/results"} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowLeft className="h-4 w-4" />{hasPreferences ? "Back to Recommendations" : "Back"}</Link>
      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <PhoneImage model={phone.model} className="aspect-[4/3] min-h-56 rounded-2xl sm:aspect-[5/4]" priority />
        <Card className="border-slate-200 shadow-none">
          <CardContent className="flex h-full flex-col p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2"><Badge variant="secondary">{phone.brand}</Badge>{phone.fiveG && <Badge variant="blue">5G</Badge>}<span className="text-xs text-amber-700">★ {phone.rating.toFixed(1)}</span>{matchScore !== null && <Badge variant="success">{matchScore}% Match · Demo</Badge>}</div>
            <h1 className="mt-4 text-2xl font-bold text-slate-950 sm:text-3xl">{phone.model}</h1>
            <p className="mt-1 text-sm text-slate-600">{phone.variant}</p>
            <p className="mt-5 text-3xl font-bold text-slate-950">{formatINR(phone.price)}</p>
            <p className="mt-1 text-xs text-slate-500">Catalog price shown for demo purposes.</p>
            <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
              <Button asChild variant="outline" className="min-h-11"><Link href={`/app/compare?phones=${encodeURIComponent(phone.id)}${preferences ? `&preferences=${preferenceQuery}` : ""}`}><GitCompareArrows className="h-4 w-4" />Compare</Link></Button>
              <Button type="button" aria-label={saved ? "Remove saved phone" : "Save phone"} aria-pressed={saved} onClick={() => { if (saved) { removeSavedPhoneId(phone.id); setSaveStatus("Removed from saved phones."); } else { savePhoneId(phone.id); setSaveStatus("Saved in this browser."); } }} className="min-h-11"><Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />{saved ? "Saved to your phones" : "Save Phone"}</Button>
            </div>
            {saveStatus && <p role="status" className="mt-2 text-xs font-medium text-emerald-800">{saveStatus}</p>}
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Smartphone className="h-4 w-4 text-emerald-700" />Specifications</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <dl className="grid gap-2 sm:grid-cols-2">
              {specs.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 px-3 py-3"><dt className="text-[10px] font-semibold uppercase text-slate-500">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd></div>)}
            </dl>
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card className="border-emerald-100">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CheckCircle2 className="h-4 w-4 text-emerald-700" />Why it matches you</CardTitle></CardHeader>
            <CardContent className="pt-0"><ul className="space-y-2">{(explanation.reasons.length ? explanation.reasons : ["Balanced option for the preferences you selected."]).map(reason => <li key={reason} className="flex items-start gap-2 text-sm leading-5 text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />{reason}</li>)}</ul></CardContent>
          </Card>
          <Card className="border-amber-100">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-amber-700" />Potential trade-offs</CardTitle></CardHeader>
            <CardContent className="pt-0"><ul className="space-y-2">{(explanation.tradeoffs.length ? explanation.tradeoffs : [profile && profile.cameraScore < 8 ? "Camera is not its strongest area." : "No standout trade-off in this demo profile."]).map(tradeoff => <li key={tradeoff} className="flex items-start gap-2 text-sm leading-5 text-slate-700"><X className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />{tradeoff}</li>)}</ul></CardContent>
          </Card>
        </div>
      </div>
      <p className="text-xs leading-5 text-slate-500">This is a demo recommendation using mock catalog information and local scoring. Prices and match details are not live offers.</p>
    </div>
  );
}
