"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Info,
  Minus,
  Save,
  Smartphone,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { DEMO_RESALE_RESULT } from "@/data/resale";
import { MOCK_SELL_PHONE_CATALOG } from "@/data/phones";
import type { PhoneCondition, ResaleValueFactor } from "@/types/resale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const conditionNames: Record<string, string> = { like_new: "Excellent", good: "Good", fair: "Fair", poor: "Poor" };

function readNonNegativeNumber(params: URLSearchParams, key: string, fallback: number): number {
  const value = Number(params.get(key));
  return params.has(key) && Number.isFinite(value) && value >= 0 ? value : fallback;
}

export function ResaleResult() {
  const params = useSearchParams();
  const [saved, setSaved] = useState(false);
  const demoForm = DEMO_RESALE_RESULT.form;
  const demoPrediction = DEMO_RESALE_RESULT.prediction;
  const conditionParam = params.get("condition");
  const usageDurationParam = params.get("usageDurationYears");
  const rangeMin = readNonNegativeNumber(params, "rangeMin", demoPrediction.range.min);
  const rangeMax = readNonNegativeNumber(params, "rangeMax", demoPrediction.range.max);
  const hasValidRange = rangeMin < rangeMax;
  const form = {
    brand: params.get("brand") || demoForm.brand,
    model: params.get("model") || demoForm.model,
    variant: params.get("variant") || demoForm.variant,
    usageDurationYears: usageDurationParam && Number.isFinite(Number(usageDurationParam)) && Number(usageDurationParam) >= 0 ? usageDurationParam : demoForm.usageDurationYears,
    batteryHealth: Math.min(100, readNonNegativeNumber(params, "batteryHealth", demoForm.batteryHealth)),
    warranty: (params.get("warranty") as "yes" | "no" | null) || demoForm.warranty,
    condition: (conditionParam as PhoneCondition | null) || demoForm.condition,
    screenCracks: params.get("screenCracks") === "true" || (params.get("screenCracks") === null && demoForm.screenCracks),
    majorScratches: params.get("majorScratches") === "true" || (params.get("majorScratches") === null && demoForm.majorScratches),
    previousRepair: params.get("previousRepair") === "true" || (params.get("previousRepair") === null && demoForm.previousRepair),
    originalBox: params.get("originalBox") === "true" || (params.get("originalBox") === null && demoForm.originalBox),
    originalCharger: params.get("originalCharger") === "true" || (params.get("originalCharger") === null && demoForm.originalCharger),
  };
  const prediction = {
    ...demoPrediction,
    id: params.get("predictionId") || demoPrediction.id,
    estimatedValue: readNonNegativeNumber(params, "estimatedValue", demoPrediction.estimatedValue),
    range: hasValidRange ? { min: rangeMin, max: rangeMax } : demoPrediction.range,
  };
  const selectedVariant = MOCK_SELL_PHONE_CATALOG
    .find(brand => brand.brand === form.brand)?.models
    .find(model => model.name === form.model)?.variants
    .find(variant => variant.label === form.variant);
  const rangePosition = Math.max(0, Math.min(100, ((prediction.estimatedValue - prediction.range.min) / (prediction.range.max - prediction.range.min)) * 100));

  return (
    <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/app/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowLeft className="h-4 w-4" />Back to Dashboard</Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><Info className="h-3.5 w-3.5" />Demo prediction</span>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-emerald-100 shadow-sm">
          <CardContent className="p-5 sm:p-8">
            <p className="text-sm font-semibold text-emerald-800">Your Estimated Resale Value</p>
            <p className="mt-3 text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">{formatINR(prediction.estimatedValue)}</p>
            <p className="mt-2 text-sm text-slate-600">Estimated range</p>
            <p className="mt-1 text-lg font-semibold text-slate-800 sm:text-xl">{formatINR(prediction.range.min)} <span className="font-normal text-slate-400">to</span> {formatINR(prediction.range.max)}</p>
            <ValueRange min={prediction.range.min} max={prediction.range.max} value={prediction.estimatedValue} position={rangePosition} />
            <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900"><CheckCircle2 className="h-4 w-4" />Estimate generated from demo data, not a live market quote.</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Smartphone className="h-4 w-4 text-emerald-700" />Your Device Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <h2 className="text-lg font-bold text-slate-950">{form.brand} {form.model}</h2>
            <p className="mt-1 text-sm text-slate-600">{form.variant}</p>
            <dl className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-100 px-3">
              <SummaryRow label="Used" value={`${form.usageDurationYears} ${Number(form.usageDurationYears) === 1 ? "year" : "years"}`} />
              <SummaryRow label="Battery" value={`${form.batteryHealth}%`} />
              <SummaryRow label="Condition" value={conditionNames[form.condition] ?? form.condition} />
              <SummaryRow label="Warranty" value={form.warranty === "yes" ? "Yes" : "No"} />
              {selectedVariant && <SummaryRow label="Original price" value={formatINR(selectedVariant.originalPrice)} />}
            </dl>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="value-breakdown-heading">
        <div className="mb-4">
          <h2 id="value-breakdown-heading" className="text-xl font-bold text-slate-950">Value Breakdown</h2>
          <p className="mt-1 text-sm text-slate-600">The demo factors represented in this estimate.</p>
        </div>
        <Card>
          <CardContent className="divide-y divide-slate-100 p-0">
            {prediction.breakdown.map(factor => <BreakdownItem key={factor.name} factor={factor} />)}
          </CardContent>
        </Card>
      </section>

      <Card className="border-sky-100 bg-sky-50/50 shadow-none">
        <CardContent className="flex items-start gap-3 p-5 sm:p-6">
          <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-sky-800" />
          <div>
            <h2 className="text-base font-bold text-slate-950">Why this estimate?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">Your phone&apos;s estimated value is influenced by its age, condition, battery health, storage capacity and historical pricing patterns.</p>
            <p className="mt-3 text-xs leading-5 text-slate-500">Detailed explainability can be powered by SHAP when the production ML model is connected. SHAP is not running in this demo.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
        <Button type="button" onClick={() => setSaved(true)} className="min-h-11 w-full sm:w-auto"><Save className="h-4 w-4" />{saved ? "Result saved." : "Save Result"}</Button>
        <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto"><Link href="/app/compare">Compare With Other Phones<ArrowRight className="h-4 w-4" /></Link></Button>
        <Button asChild variant="ghost" className="min-h-11 w-full sm:ml-auto sm:w-auto"><Link href="/app/sell">Sell Another Phone<ArrowRight className="h-4 w-4" /></Link></Button>
      </div>
      {saved && <p role="status" className="-mt-2 text-sm font-medium text-emerald-800">Result saved in this demo session.</p>}
      <p className="rounded-lg bg-slate-100/80 px-4 py-3 text-xs leading-5 text-slate-500">Estimated value only. Actual resale value may vary based on buyer, market conditions, device verification and other factors.</p>
    </div>
  );
}

function ValueRange({ min, max, value, position }: { min: number; max: number; value: number; position: number }) {
  return (
    <div className="mt-7 px-1" role="img" aria-label={`Estimated value ${formatINR(value)} within a range of ${formatINR(min)} to ${formatINR(max)}`}>
      <div className="relative h-2 rounded-full bg-slate-100">
        <div className="absolute inset-y-0 left-0 rounded-full bg-emerald-200" style={{ width: `${position}%` }} />
        <span className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-emerald-700 shadow" style={{ left: `${position}%` }} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 text-xs text-slate-500">
        <span>{formatINR(min)}</span>
        <span className="-mt-1 text-center font-bold text-emerald-800">{formatINR(value)}<span className="block text-[10px] font-medium text-slate-500">estimated</span></span>
        <span className="text-right">{formatINR(max)}</span>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 py-2.5"><dt className="text-xs text-slate-500">{label}</dt><dd className="text-right text-xs font-semibold text-slate-800">{value}</dd></div>;
}

function BreakdownItem({ factor }: { factor: ResaleValueFactor }) {
  const icon = factor.impact === "positive" ? ThumbsUp : factor.impact === "negative" ? ThumbsDown : Minus;
  const Icon = icon;
  const color = factor.impact === "positive" ? "text-emerald-700 bg-emerald-50" : factor.impact === "negative" ? "text-amber-700 bg-amber-50" : "text-slate-500 bg-slate-100";
  const impactLabel = factor.impact === "positive" ? "Supports value" : factor.impact === "negative" ? "Affects value" : "Considered";
  return <div className="flex items-start gap-3 px-4 py-4 sm:px-5"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-900">{factor.name}</p><span className="text-[11px] font-medium text-slate-500">{impactLabel}</span></div><p className="mt-1 text-xs leading-5 text-slate-600">{factor.explanation}</p></div></div>;
}
