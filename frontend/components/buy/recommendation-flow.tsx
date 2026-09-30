"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  BriefcaseBusiness,
  Camera,
  Check,
  Clapperboard,
  Cpu,
  Gamepad2,
  GraduationCap,
  LoaderCircle,
  Monitor,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { DEFAULT_RECOMMENDATION_PREFERENCES } from "@/data/recommendations";
import { getRecommendations } from "@/lib/api/recommendations";
import { formatINR } from "@/lib/utils";
import type { RecommendationPreferences, RecommendationPriorityFactor, RecommendationUsage } from "@/types/recommendation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";

const steps = ["Budget", "Usage", "Requirements", "Priorities"] as const;
const usageOptions: { id: RecommendationUsage; title: string; detail: string; icon: typeof Gamepad2 }[] = [
  { id: "gaming", title: "Gaming", detail: "Performance for demanding games.", icon: Gamepad2 },
  { id: "photography", title: "Photography", detail: "Camera quality and image processing.", icon: Camera },
  { id: "study", title: "Study", detail: "Everyday reliability and battery life.", icon: GraduationCap },
  { id: "work", title: "Work", detail: "Productivity and multitasking.", icon: BriefcaseBusiness },
  { id: "entertainment", title: "Entertainment", detail: "Display, speakers and media experience.", icon: Clapperboard },
  { id: "general", title: "General Use", detail: "Balanced everyday smartphone experience.", icon: Smartphone },
];
const priorityOptions: { id: RecommendationPriorityFactor; label: string }[] = [
  { id: "performance", label: "Performance" },
  { id: "battery", label: "Battery" },
  { id: "camera", label: "Camera" },
  { id: "display", label: "Display" },
  { id: "storage", label: "Storage" },
  { id: "value", label: "Value for Money" },
];
const loadingStages = ["Checking your budget", "Matching requirements", "Comparing smartphones", "Personalizing recommendations"];

export function RecommendationFlow({ initialPreferences = DEFAULT_RECOMMENDATION_PREFERENCES }: { initialPreferences?: RecommendationPreferences }) {
  const router = useRouter();
  const [preferences, setPreferences] = useState<RecommendationPreferences>(initialPreferences);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState("");

  const isValid = step !== 2 || preferences.usage.length > 0;

  function update<K extends keyof RecommendationPreferences>(key: K, value: RecommendationPreferences[K]) {
    setPreferences(current => ({ ...current, [key]: value }));
    setError("");
  }

  function toggleUsage(usage: RecommendationUsage) {
    setPreferences(current => ({
      ...current,
      usage: current.usage.includes(usage) ? current.usage.filter(item => item !== usage) : [...current.usage, usage],
    }));
    setError("");
  }

  async function continueStep() {
    if (!isValid) {
      setError("Select at least one activity to continue.");
      return;
    }
    if (step < 4) {
      setStep(current => current + 1);
      setError("");
      return;
    }

    setIsLoading(true);
    setLoadingStage(0);
    setError("");
    try {
      const recommendationRequest = getRecommendations(preferences);
      for (let index = 1; index < loadingStages.length; index += 1) {
        await new Promise(resolve => setTimeout(resolve, 550));
        setLoadingStage(index);
      }
      await recommendationRequest;
      router.push(`/app/buy/results?preferences=${encodeURIComponent(JSON.stringify(preferences))}`);
    } catch {
      setIsLoading(false);
      setError("Unable to find recommendations right now. Please try again or adjust your preferences.");
    }
  }

  if (isLoading) {
    return (
      <Card className="mx-auto w-full max-w-3xl border-white shadow-sm">
        <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Sparkles className="h-6 w-6" /></span>
          <h2 className="mt-5 text-2xl font-bold text-slate-950">Finding phones for you...</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">Matching smartphones against your budget and preferences. This is a demo matching process, not a live ML service.</p>
          <div className="mt-7 w-full max-w-sm space-y-4 text-left" aria-live="polite">
            {loadingStages.map((stage, index) => <div key={stage} className="flex items-center gap-3 text-sm"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${index < loadingStage ? "bg-emerald-700 text-white" : index === loadingStage ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>{index < loadingStage ? <Check className="h-3.5 w-3.5" /> : index === loadingStage ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <span className="text-[10px]">{index + 1}</span>}</span><span className={index <= loadingStage ? "font-medium text-slate-800" : "text-slate-400"}>{stage}</span></div>)}
          </div>
          <Progress value={(loadingStage + 1) * 25} size="sm" className="mt-7 max-w-sm" aria-label="Demo recommendation progress" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-3xl border-white shadow-sm">
      <CardContent className="p-5 sm:p-8 lg:p-10">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-800">Step {step} of 4</span><span className="text-xs text-slate-500">{steps[step - 1]}</span></div>
          <Progress value={step * 25} size="sm" aria-label={`Step ${step} of 4`} />
          <div className="mt-3 grid grid-cols-4 gap-1" aria-hidden="true">{steps.map((name, index) => <span key={name} className={`h-1 rounded-full ${index < step ? "bg-emerald-600" : "bg-slate-100"}`} />)}</div>
        </div>

        {step === 1 && <section aria-labelledby="budget-step-heading">
          <StepHeading id="budget-step-heading" title="What's your budget?" description="Choose the price range you're comfortable with." />
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
            <p className="text-xs font-medium text-slate-600">Your budget</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{formatINR(preferences.budgetMin)} <span className="font-normal text-slate-400">–</span> {formatINR(preferences.budgetMax)}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <RangeField id="budget-min" label="Minimum" value={preferences.budgetMin} min={10000} max={Math.min(145000, preferences.budgetMax - 5000)} onChange={value => update("budgetMin", value)} />
              <RangeField id="budget-max" label="Maximum" value={preferences.budgetMax} min={Math.max(15000, preferences.budgetMin + 5000)} max={150000} onChange={value => update("budgetMax", value)} />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-slate-500"><span>₹10,000</span><span>₹1,50,000</span></div>
          </div>
          <fieldset className="mt-7">
            <legend className="text-sm font-semibold text-slate-800">Preferred phone type</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">{(["new", "refurbished", "either"] as const).map(type => <button key={type} type="button" aria-pressed={preferences.phoneType === type} onClick={() => update("phoneType", type)} className={`min-h-11 rounded-xl border px-2 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${preferences.phoneType === type ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{type}</button>)}</div>
          </fieldset>
        </section>}

        {step === 2 && <section aria-labelledby="usage-step-heading">
          <StepHeading id="usage-step-heading" title="What will you mainly use your phone for?" description="Select the activities that matter most to you." />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {usageOptions.map(({ id, title, detail, icon: Icon }) => { const selected = preferences.usage.includes(id); return <button key={id} type="button" aria-pressed={selected} onClick={() => toggleUsage(id)} className={`flex min-h-24 items-start gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${selected ? "border-emerald-600 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-emerald-300"}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-white text-emerald-700" : "bg-slate-50 text-slate-500"}`}><Icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{detail}</span></span><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 bg-white"}`}>{selected && <Check className="h-3 w-3" />}</span></button>; })}
          </div>
          {!preferences.usage.length && <p className="mt-3 text-xs text-slate-500">Select at least one activity to continue.</p>}
        </section>}

        {step === 3 && <section aria-labelledby="requirements-step-heading">
          <StepHeading id="requirements-step-heading" title="What matters to you?" description="Set the minimum features you expect from your phone." />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FormSelect label="Minimum RAM" id="min-ram" value={String(preferences.minRam)} onChange={value => update("minRam", Number(value))} options={[["4", "4 GB"], ["6", "6 GB"], ["8", "8 GB"], ["12", "12 GB"], ["16", "16 GB"]]} />
            <FormSelect label="Minimum Storage" id="min-storage" value={String(preferences.minStorage)} onChange={value => update("minStorage", Number(value))} options={[["64", "64 GB"], ["128", "128 GB"], ["256", "256 GB"], ["512", "512 GB"], ["1024", "1 TB"]]} />
            <FormSelect label="5G" id="five-g" value={preferences.fiveG} onChange={value => update("fiveG", value as RecommendationPreferences["fiveG"])} options={[["required", "Required"], ["preferred", "Preferred"], ["not-important", "Not Important"]]} />
            <FormSelect label="Battery" id="battery-preference" value={preferences.battery} onChange={value => update("battery", value as RecommendationPreferences["battery"])} options={[["high", "High"], ["medium", "Medium"], ["no-preference", "No Preference"]]} />
            <FormSelect label="Display" id="display-preference" value={preferences.display} onChange={value => update("display", value as RecommendationPreferences["display"])} options={[["high", "High"], ["medium", "Medium"], ["no-preference", "No Preference"]]} />
            <FormSelect label="Camera" id="camera-preference" value={preferences.camera} onChange={value => update("camera", value as RecommendationPreferences["camera"])} options={[["high", "High"], ["medium", "Medium"], ["no-preference", "No Preference"]]} />
            <FormSelect label="Performance" id="performance-preference" value={preferences.performance} onChange={value => update("performance", value as RecommendationPreferences["performance"])} options={[["very-high", "Very High"], ["high", "High"], ["medium", "Medium"], ["no-preference", "No Preference"]]} />
          </div>
        </section>}

        {step === 4 && <section aria-labelledby="priorities-step-heading">
          <StepHeading id="priorities-step-heading" title="Which factors matter most?" description="Set a priority level for each factor. We use these to shape your mock ranking." />
          <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
            {priorityOptions.map(({ id, label }) => <div key={id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2 text-sm font-medium text-slate-800"><PriorityIcon factor={id} />{label}</span><div className="flex gap-2">{(["high", "medium", "low"] as const).map(level => <button key={level} type="button" aria-pressed={preferences.priorities[id] === level} onClick={() => update("priorities", { ...preferences.priorities, [id]: level })} className={`min-h-9 min-w-20 rounded-lg border px-2 text-xs font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${preferences.priorities[id] === level ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{level}</button>)}</div></div>)}
          </div>
        </section>}

        {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{error}</p>}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {step === 1 ? <Button type="button" variant="ghost" onClick={() => router.push("/app/dashboard")} className="min-h-11"><ArrowLeft className="h-4 w-4" />Back to Dashboard</Button> : <Button type="button" variant="ghost" onClick={() => { setStep(value => value - 1); setError(""); }} className="min-h-11"><ArrowLeft className="h-4 w-4" />Back</Button>}
          <Button type="button" onClick={() => void continueStep()} disabled={!isValid} className="min-h-11 w-full sm:w-auto">{step === 4 ? "Find My Phone" : "Continue"}<ArrowRight className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StepHeading({ id, title, description }: { id: string; title: string; description: string }) {
  return <div><h2 id={id} className="text-xl font-bold text-slate-950 sm:text-2xl">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div>;
}

function RangeField({ id, label, value, min, max, onChange }: { id: string; label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <div><div className="mb-1 flex items-center justify-between text-xs"><label htmlFor={id} className="font-medium text-slate-700">{label}</label><span className="text-slate-500">{formatINR(value)}</span></div><input id={id} type="range" min={min} max={Math.max(min, max)} step="5000" value={value} onChange={event => onChange(Number(event.target.value))} className="w-full accent-emerald-700" aria-valuetext={formatINR(value)} /></div>;
}

function FormSelect({ label, id, value, onChange, options }: { label: string; id: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return <div><label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-800">{label}</label><Select id={id} value={value} onChange={event => onChange(event.target.value)}>{options.map(([optionValue, text]) => <option key={optionValue} value={optionValue}>{text}</option>)}</Select></div>;
}

function PriorityIcon({ factor }: { factor: RecommendationPriorityFactor }) {
  const icons = { performance: Cpu, battery: BatteryCharging, camera: Camera, display: Monitor, storage: Smartphone, value: Sparkles };
  const Icon = icons[factor];
  return <Icon className="h-4 w-4 text-emerald-700" aria-hidden="true" />;
}
