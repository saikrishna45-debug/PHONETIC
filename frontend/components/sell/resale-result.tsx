"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Info,
  Save,
  Smartphone,
} from "lucide-react";
import { MOCK_SELL_PHONE_CATALOG } from "@/data/phones";
import type { PhoneCondition } from "@/types/resale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const formatExactINR = (value: number) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const conditionNames: Record<string, string> = { like_new: "Excellent", good: "Good", fair: "Fair", poor: "Poor" };

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 py-2.5"><dt className="text-xs text-slate-500">{label}</dt><dd className="text-right text-xs font-semibold text-slate-800">{value}</dd></div>;
}

function readNonNegativeNumber(params: URLSearchParams, key: string): number | null {
  const serialized = params.get(key);
  if (serialized === null || serialized.trim() === "") return null;
  const value = Number(serialized);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function ResaleResult() {
  const router = useRouter();
  const params = useSearchParams();
  const [saved, setSaved] = useState(false);
  const estimatedPrice = readNonNegativeNumber(params, "estimatedResalePrice");
  const displayPrice = readNonNegativeNumber(params, "displayPrice");

  if (estimatedPrice === null || displayPrice === null) {
    return <EmptyState title="No resale estimate found" description="Complete the Sell My Phone flow to request a current model estimate." action={{ label: "Start estimate", onClick: () => router.push("/app/sell") }} />;
  }

  const usageDuration = readNonNegativeNumber(params, "usageDurationYears");
  const batteryHealth = readNonNegativeNumber(params, "batteryHealth");
  const conditionParam = params.get("condition") ?? "";
  const form = {
    brand: params.get("brand") ?? "",
    model: params.get("model") ?? "",
    variant: params.get("variant") ?? "",
    usageDurationYears: usageDuration,
    batteryHealth,
    warranty: params.get("warranty") ?? "",
    condition: (conditionNames[conditionParam] ? conditionParam : "") as PhoneCondition | "",
    screenCracks: params.get("screenCracks") === "true",
    majorScratches: params.get("majorScratches") === "true",
    previousRepair: params.get("previousRepair") === "true",
    originalBox: params.get("originalBox") === "true",
    originalCharger: params.get("originalCharger") === "true",
  };
  const selectedVariant = MOCK_SELL_PHONE_CATALOG
    .find(brand => brand.brand === form.brand)?.models
    .find(model => model.name === form.model)?.variants
    .find(variant => variant.label === form.variant);

  return (
    <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/app/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowLeft className="h-4 w-4" />Back to Dashboard</Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><Info className="h-3.5 w-3.5" />Resale model estimate · {params.get("modelVersion") || "v1"}</span>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-emerald-100 shadow-sm">
          <CardContent className="p-5 sm:p-8">
            <p className="text-sm font-semibold text-emerald-800">Your Estimated Resale Value</p>
            <p className="mt-3 text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">{formatExactINR(estimatedPrice)}</p>
            <p className="mt-2 text-sm text-slate-600">Display price</p>
            <p className="mt-1 text-lg font-semibold text-slate-800 sm:text-xl">{formatINR(displayPrice)}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900"><CheckCircle2 className="h-4 w-4" />Estimate returned by the PHONETIC resale model.</p>
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
              <SummaryRow label="Used" value={form.usageDurationYears === null ? "Not provided" : `${form.usageDurationYears} ${form.usageDurationYears === 1 ? "year" : "years"}`} />
              <SummaryRow label="Battery" value={form.batteryHealth === null ? "Not provided" : `${form.batteryHealth}%`} />
              <SummaryRow label="Condition" value={conditionNames[form.condition] ?? "Not provided"} />
              <SummaryRow label="Warranty" value={form.warranty === "yes" ? "Yes" : "No"} />
              {selectedVariant && <SummaryRow label="Original price" value={formatINR(selectedVariant.originalPrice)} />}
            </dl>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="value-breakdown-heading">
        <div className="mb-4">
          <h2 id="value-breakdown-heading" className="text-xl font-bold text-slate-950">Value Breakdown</h2>
          <p className="mt-1 text-sm text-slate-600">Details available from the resale prediction service.</p>
        </div>
        <Card>
          <CardContent className="p-5 sm:p-6">
            <p className="text-sm font-semibold text-slate-900">Total resale estimate</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">The current API returns an overall estimate; per-feature breakdowns are not available.</p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-sky-100 bg-sky-50/50 shadow-none">
        <CardContent className="flex items-start gap-3 p-5 sm:p-6">
          <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-sky-800" />
          <div>
            <h2 className="text-base font-bold text-slate-950">Why this estimate?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">This value is generated by the existing PHONETIC resale model from the phone details and condition you provided.</p>
            <p className="mt-3 text-xs leading-5 text-slate-500">Feature-level explanations are not included in the current resale API response.</p>
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


