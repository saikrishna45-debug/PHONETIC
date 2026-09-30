"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Gamepad2, GraduationCap, Heart, Laptop, Camera, Sparkles, Smartphone, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const purposes = [
  { id: "sell", title: "Sell my phone", description: "Understand what your current phone may be worth.", icon: Tag },
  { id: "buy", title: "Buy a new phone", description: "Find a phone that fits your priorities and budget.", icon: Smartphone },
  { id: "both", title: "Both", description: "Plan your current phone sale and your next purchase.", icon: Sparkles },
] as const;

const usageOptions = [
  { id: "gaming", title: "Gaming", icon: Gamepad2 },
  { id: "photography", title: "Photography", icon: Camera },
  { id: "study", title: "Study", icon: GraduationCap },
  { id: "work", title: "Work", icon: BriefcaseBusiness },
  { id: "social", title: "Social", icon: Heart },
  { id: "entertainment", title: "Entertainment", icon: Laptop },
  { id: "general", title: "General Use", icon: Smartphone },
] as const;

type Purpose = (typeof purposes)[number]["id"];
type Usage = (typeof usageOptions)[number]["id"];

interface OnboardingData {
  purpose: Purpose | "";
  budget: number;
  usage: Usage[];
}

const initialData: OnboardingData = { purpose: "", budget: 50000, usage: [] };
const purposeLabels: Record<Purpose, string> = {
  sell: "Sell my phone",
  buy: "Buy a new phone",
  both: "Both",
};
const usageLabels: Record<Usage, string> = {
  gaming: "Gaming",
  photography: "Photography",
  study: "Study",
  work: "Work",
  social: "Social",
  entertainment: "Entertainment",
  general: "General Use",
};
const formatBudget = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);

  function canContinue() {
    if (step === 1) return Boolean(data.purpose);
    if (step === 2) return data.budget >= 10000 && data.budget <= 150000;
    return data.usage.length > 0;
  }

  function next() {
    if (!canContinue()) return;
    setStep(current => Math.min(4, current + 1));
  }

  function back() {
    setStep(current => Math.max(1, current - 1));
  }

  function toggleUsage(value: Usage) {
    setData(current => ({
      ...current,
      usage: current.usage.includes(value)
        ? current.usage.filter(item => item !== value)
        : [...current.usage, value],
    }));
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase text-emerald-700">A more personal Phonetic</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950">Let&apos;s make this yours.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">A few quick details will help us tailor your experience.</p>
      </div>
      <Card className="border-white/90 shadow-md shadow-slate-900/5">
        <CardContent className="p-5 sm:p-8">
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">Step {step} of 4</span>
              <span className="text-xs font-medium text-slate-500">{step === 4 ? "Complete" : "About 1 minute"}</span>
            </div>
            <Progress value={step * 25} size="sm" aria-label={`Step ${step} of 4`} />
            <div className="mt-3 grid grid-cols-4 gap-1" aria-hidden="true">
              {[1, 2, 3, 4].map(item => <span key={item} className={`h-1 rounded-full ${item <= step ? "bg-emerald-600" : "bg-slate-100"}`} />)}
            </div>
          </div>

          {step === 1 && (
            <section aria-labelledby="purpose-heading">
              <h2 id="purpose-heading" className="text-xl font-bold text-slate-950 sm:text-2xl">What brings you to Phonetic?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Tell us what you want to do so we can personalize your experience.</p>
              <div className="mt-6 grid gap-3">
                {purposes.map(({ id, title, description, icon: Icon }) => {
                  const selected = data.purpose === id;
                  return <button key={id} type="button" aria-pressed={selected} onClick={() => setData(current => ({ ...current, purpose: id }))} className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${selected ? "border-emerald-600 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"}`}>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-white text-emerald-700" : "bg-slate-50 text-slate-500"}`}><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{description}</span></span>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 bg-white"}`}>{selected && <Check className="h-3 w-3" />}</span>
                  </button>;
                })}
              </div>
              {!data.purpose && <p className="mt-3 text-xs text-slate-500">Choose one option to continue.</p>}
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="budget-heading">
              <h2 id="budget-heading" className="text-xl font-bold text-slate-950 sm:text-2xl">What&apos;s your budget?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Choose the budget range you&apos;re comfortable with.</p>
              <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-7 text-center">
                <p className="text-xs font-medium text-slate-600">Your selected budget</p>
                <output htmlFor="budget-slider" className="mt-2 block text-4xl font-bold text-slate-950">{formatBudget(data.budget)}</output>
              </div>
              <label htmlFor="budget-slider" className="sr-only">Choose your budget from ₹10,000 to ₹1,50,000</label>
              <input id="budget-slider" type="range" min="10000" max="150000" step="5000" value={data.budget} onChange={event => setData(current => ({ ...current, budget: Number(event.target.value) }))} className="mt-8 w-full accent-emerald-600" />
              <div className="mt-2 flex justify-between text-xs font-medium text-slate-500"><span>₹10,000</span><span>₹1,50,000</span></div>
              <p className="mt-6 rounded-lg bg-sky-50 px-4 py-3 text-xs leading-5 text-sky-900">You can adjust this later. We&apos;ll use it to keep recommendations in a comfortable range.</p>
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="usage-heading">
              <h2 id="usage-heading" className="text-xl font-bold text-slate-950 sm:text-2xl">How will you use your phone?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Select the activities that matter most to you.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {usageOptions.map(({ id, title, icon: Icon }) => {
                  const selected = data.usage.includes(id);
                  return <button key={id} type="button" aria-pressed={selected} onClick={() => toggleUsage(id)} className={`relative flex min-h-24 flex-col items-start justify-between gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${selected ? "border-emerald-600 bg-emerald-50" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"}`}>
                    <Icon className={`h-5 w-5 ${selected ? "text-emerald-700" : "text-slate-500"}`} />
                    <span className="text-sm font-semibold text-slate-800">{title}</span>
                    <span className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 bg-white"}`}>{selected && <Check className="h-3 w-3" />}</span>
                  </button>;
                })}
              </div>
              {!data.usage.length && <p className="mt-3 text-xs text-slate-500">Choose at least one activity to continue.</p>}
            </section>
          )}

          {step === 4 && (
            <section aria-labelledby="complete-heading" className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Check className="h-8 w-8" /></span>
              <h2 id="complete-heading" className="mt-5 text-2xl font-bold text-slate-950">You&apos;re all set!</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Phonetic is ready to help you make smarter smartphone decisions.</p>
              <dl className="mt-7 divide-y divide-slate-100 rounded-xl border border-slate-200 text-left">
                <SummaryRow label="Purpose" value={data.purpose ? purposeLabels[data.purpose] : "Not selected"} />
                <SummaryRow label="Budget" value={formatBudget(data.budget)} />
                <SummaryRow label="Usage" value={data.usage.map(item => usageLabels[item]).join(", ") || "Not selected"} />
              </dl>
            </section>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            {step === 1 ? <Link href="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowLeft className="h-4 w-4" />Back</Link> : <Button type="button" variant="ghost" onClick={back} className="min-h-11"><ArrowLeft className="h-4 w-4" />Back</Button>}
            {step < 4 ? <Button type="button" onClick={next} disabled={!canContinue()} className="min-h-11 w-full sm:w-auto">Continue<ArrowRight className="h-4 w-4" /></Button> : <Button type="button" onClick={() => router.push("/app/dashboard")} className="min-h-11 w-full sm:w-auto">Go to Phonetic<ArrowRight className="h-4 w-4" /></Button>}
          </div>
        </CardContent>
      </Card>
      {step < 4 && <p className="mt-4 text-center text-xs text-slate-500">Your answers stay in this session for now.</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6"><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className="text-sm font-semibold text-slate-900 sm:max-w-[70%] sm:text-right">{value}</dd></div>;
}
