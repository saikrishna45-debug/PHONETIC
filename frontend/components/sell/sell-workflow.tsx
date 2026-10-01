"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Battery,
  Check,
  CheckCircle2,
  Circle,
  LoaderCircle,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";
import { MOCK_SELL_PHONE_CATALOG } from "@/data/phones";
import { predictResaleValue, ResaleApiError } from "@/lib/api/resale";
import type { PhoneCondition, SellPhoneFormData } from "@/types/resale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";

const steps = ["Select phone", "Device details", "Condition", "More details"] as const;

const conditionOptions: { id: PhoneCondition; title: string; description: string }[] = [
  { id: "like_new", title: "Excellent", description: "Like new with minimal signs of use.", },
  { id: "good", title: "Good", description: "Light signs of normal use.", },
  { id: "fair", title: "Fair", description: "Visible wear but fully functional.", },
  { id: "poor", title: "Poor", description: "Heavy wear or significant damage.", },
];

const initialForm: SellPhoneFormData = {
  brand: "",
  model: "",
  variant: "",
  usageDurationYears: "",
  batteryHealth: 87,
  warranty: "",
  condition: "",
  screenCracks: null,
  majorScratches: null,
  previousRepair: null,
  originalBox: null,
  originalCharger: null,
};

const loadingStages = [
  "Checking device details",
  "Sending details to the resale model",
  "Calculating your estimate",
  "Preparing your result",
];

export function SellWorkflow() {
  const router = useRouter();
  const submissionInProgress = useRef(false);
  const [form, setForm] = useState<SellPhoneFormData>(initialForm);
  const [step, setStep] = useState(1);
  const [isPredicting, setIsPredicting] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const selectedBrand = MOCK_SELL_PHONE_CATALOG.find(item => item.brand === form.brand);
  const selectedModel = selectedBrand?.models.find(item => item.name === form.model);
  const selectedVariant = selectedModel?.variants.find(item => item.label === form.variant);
  const isPhoneStepValid = Boolean(form.brand && form.model && form.variant);
  const isDetailsStepValid = Boolean(form.usageDurationYears && form.warranty);
  const isConditionStepValid = Boolean(form.condition);
  const isAdditionalStepValid = [form.screenCracks, form.majorScratches, form.previousRepair, form.originalBox, form.originalCharger].every(value => value !== null);

  const canContinue = useMemo(() => {
    if (step === 1) return isPhoneStepValid;
    if (step === 2) return isDetailsStepValid;
    if (step === 3) return isConditionStepValid;
    return isAdditionalStepValid;
  }, [isAdditionalStepValid, isConditionStepValid, isDetailsStepValid, isPhoneStepValid, step]);

  function updateForm<K extends keyof SellPhoneFormData>(key: K, value: SellPhoneFormData[K]) {
    setForm(current => ({ ...current, [key]: value }));
    setError("");
  }

  function validateCurrentStep() {
    if (step === 1 && !isPhoneStepValid) return "Please select a brand, model and variant.";
    if (step === 2 && !isDetailsStepValid) return "Please enter usage duration and warranty status.";
    if (step === 3 && !isConditionStepValid) return "Please choose the condition that best describes your phone.";
    if (step === 4 && !isAdditionalStepValid) return "Please answer each of the additional questions.";
    return "";
  }

  function continueStep() {
    const message = validateCurrentStep();
    if (message) {
      setError(message);
      return;
    }
    setStep(current => Math.min(4, current + 1));
    setError("");
  }

  function backStep() {
    setStep(current => Math.max(1, current - 1));
    setError("");
  }

  async function runPrediction() {
    if (submissionInProgress.current) return;
    const message = validateCurrentStep();
    if (message) {
      setError(message);
      return;
    }
    if (!selectedVariant) {
      setError("Please complete all required fields.");
      return;
    }

    submissionInProgress.current = true;
    setIsPredicting(true);
    setLoadingStage(0);
    setError("");
    try {
      setLoadingStage(1);
      const prediction = await predictResaleValue(form);
      setLoadingStage(3);
      const params = new URLSearchParams({
        brand: form.brand,
        model: form.model,
        variant: form.variant,
        usageDurationYears: form.usageDurationYears,
        batteryHealth: String(form.batteryHealth),
        warranty: form.warranty,
        condition: form.condition,
        screenCracks: String(form.screenCracks),
        majorScratches: String(form.majorScratches),
        previousRepair: String(form.previousRepair),
        originalBox: String(form.originalBox),
        originalCharger: String(form.originalCharger),
        estimatedResalePrice: String(prediction.estimated_resale_price_inr),
        displayPrice: String(prediction.display_price_inr),
        modelVersion: prediction.model_version,
      });
      router.push(`/app/sell/result?${params.toString()}`);
    } catch (error) {
      submissionInProgress.current = false;
      setIsPredicting(false);
      setError(error instanceof ResaleApiError
        ? error.message
        : "We could not generate a resale estimate right now. Please try again.");
    }
  }

  if (isPredicting) {
    return (
      <Card className="mx-auto w-full max-w-2xl border-white shadow-md">
        <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Sparkles className="h-7 w-7" /></span>
          <h2 className="mt-5 text-2xl font-bold text-slate-950">Analyzing your phone...</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">Your device details are being sent to the PHONETIC resale prediction service.</p>
          <div className="mt-7 w-full max-w-sm space-y-4 text-left" aria-live="polite">
            {loadingStages.map((stage, index) => (
              <div key={stage} className="flex items-center gap-3 text-sm">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${index < loadingStage ? "bg-emerald-700 text-white" : index === loadingStage ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                  {index < loadingStage ? <Check className="h-3.5 w-3.5" /> : index === loadingStage ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <span className="text-[10px]">{index + 1}</span>}
                </span>
                <span className={index <= loadingStage ? "font-medium text-slate-800" : "text-slate-400"}>{stage}</span>
              </div>
            ))}
          </div>
          <Progress value={(loadingStage + 1) * 25} size="sm" className="mt-7 max-w-sm" aria-label="Resale prediction progress" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-3xl border-white shadow-sm">
      <CardContent className="p-5 sm:p-8 lg:p-10">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-800">Step {step} of 4</span>
            <span className="text-xs text-slate-500">{steps[step - 1]}</span>
          </div>
          <Progress value={step * 25} size="sm" aria-label={`Step ${step} of 4`} />
          <div className="mt-3 grid grid-cols-4 gap-1" aria-hidden="true">
            {steps.map((label, index) => <span key={label} className={`h-1 rounded-full ${index < step ? "bg-emerald-600" : "bg-slate-100"}`} />)}
          </div>
        </div>

        {step === 1 && (
          <section aria-labelledby="select-phone-heading">
            <StepHeading id="select-phone-heading" title="What phone are you selling?" description="Select your device to get started." />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Brand" htmlFor="phone-brand">
                <Select id="phone-brand" value={form.brand} placeholder="Select a brand" onChange={event => setForm(current => ({ ...current, brand: event.target.value, model: "", variant: "" }))}>
                  {MOCK_SELL_PHONE_CATALOG.map(brand => <option key={brand.brand} value={brand.brand}>{brand.brand}</option>)}
                </Select>
              </Field>
              <Field label="Model" htmlFor="phone-model">
                <Select id="phone-model" value={form.model} placeholder="Select a model" disabled={!selectedBrand} onChange={event => setForm(current => ({ ...current, model: event.target.value, variant: "" }))}>
                  {selectedBrand?.models.map(model => <option key={model.name} value={model.name}>{model.name}</option>)}
                </Select>
              </Field>
              <Field label="Variant" htmlFor="phone-variant" hint={selectedVariant ? `Original price: ₹${selectedVariant.originalPrice.toLocaleString("en-IN")}` : undefined}>
                <Select id="phone-variant" value={form.variant} placeholder="Select storage and RAM" disabled={!selectedModel} onChange={event => updateForm("variant", event.target.value)}>
                  {selectedModel?.variants.map(variant => <option key={variant.label} value={variant.label}>{variant.label}</option>)}
                </Select>
              </Field>
            </div>
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="device-details-heading">
            <StepHeading id="device-details-heading" title="Tell us about your device" description="A few details help us estimate its current value." />
            <div className="mt-6 space-y-6">
              <Field label="Usage Duration" htmlFor="usage-duration" hint="How long have you owned this phone?">
                <Select id="usage-duration" value={form.usageDurationYears} placeholder="Select duration" onChange={event => updateForm("usageDurationYears", event.target.value)}>
                  <option value="0.5">Less than 1 year</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5+ years</option>
                </Select>
              </Field>
              <div>
                <div className="mb-2 flex items-end justify-between gap-3">
                  <label htmlFor="battery-health" className="text-sm font-semibold text-slate-800">Battery Health</label>
                  <output htmlFor="battery-health" className="text-lg font-bold text-emerald-800">{form.batteryHealth}%</output>
                </div>
                <input id="battery-health" type="range" min="0" max="100" step="1" value={form.batteryHealth} onChange={event => updateForm("batteryHealth", Number(event.target.value))} className="w-full accent-emerald-700" aria-valuetext={`${form.batteryHealth} percent`} />
                <div className="mt-1 flex justify-between text-xs text-slate-500"><span>0%</span><span>100%</span></div>
              </div>
              <ChoiceField label="Is the phone still under warranty?" value={form.warranty} onChange={value => updateForm("warranty", value)} choices={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
            </div>
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="condition-heading">
            <StepHeading id="condition-heading" title="How would you describe your phone?" description="Choose the condition that best matches your device." />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {conditionOptions.map(({ id, title, description }, index) => {
                const selected = form.condition === id;
                const ConditionIcon = [Sparkles, CheckCircle2, Circle, Smartphone][index];
                return (
                  <button key={id} type="button" aria-pressed={selected} onClick={() => updateForm("condition", id)} className={`flex min-h-28 items-start gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${selected ? "border-emerald-600 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-emerald-300"}`}>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-white text-emerald-700" : "bg-slate-50 text-slate-500"}`}><ConditionIcon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{description}</span></span>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 bg-white"}`}>{selected && <Check className="h-3 w-3" />}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 4 && (
          <section aria-labelledby="additional-info-heading">
            <StepHeading id="additional-info-heading" title="A few more details" description="These details help give your demo estimate useful context." />
            <div className="mt-5 divide-y divide-slate-100">
              <YesNoField label="Screen cracks?" icon={Smartphone} value={form.screenCracks} onChange={value => updateForm("screenCracks", value)} />
              <YesNoField label="Major scratches?" icon={Sparkles} value={form.majorScratches} onChange={value => updateForm("majorScratches", value)} />
              <YesNoField label="Previous repair?" icon={Wrench} value={form.previousRepair} onChange={value => updateForm("previousRepair", value)} />
              <YesNoField label="Original box?" icon={PackageCheck} value={form.originalBox} onChange={value => updateForm("originalBox", value)} />
              <YesNoField label="Original charger?" icon={Battery} value={form.originalCharger} onChange={value => updateForm("originalCharger", value)} />
            </div>
          </section>
        )}

        {error && <p role="alert" className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {step === 1 ? <Button type="button" variant="ghost" onClick={() => router.push("/app/dashboard")} className="min-h-11"><ArrowLeft className="h-4 w-4" />Back to Dashboard</Button> : <Button type="button" variant="ghost" onClick={backStep} className="min-h-11"><ArrowLeft className="h-4 w-4" />Back</Button>}
          {step < 4 ? <Button type="button" onClick={continueStep} disabled={!canContinue} className="min-h-11 w-full sm:w-auto">Continue<ArrowRight className="h-4 w-4" /></Button> : <Button type="button" onClick={() => { setAttempt(value => value + 1); void runPrediction(); }} disabled={!canContinue} className="min-h-11 w-full sm:w-auto"><ShieldCheck className="h-4 w-4" />Estimate Resale Value</Button>}
        </div>
        {step === 4 && <p className="mt-3 text-center text-xs text-slate-500">Your estimate is generated by the PHONETIC resale model.</p>}
        {attempt > 0 && error && <Button type="button" variant="outline" onClick={() => void runPrediction()} className="mt-3 w-full">Try Again</Button>}
      </CardContent>
    </Card>
  );
}

function StepHeading({ id, title, description }: { id: string; title: string; description: string }) {
  return <div><h2 id={id} className="text-xl font-bold text-slate-950 sm:text-2xl">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div>;
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return <div><label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-slate-800">{label}</label>{children}{hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}</div>;
}

function ChoiceField<T extends string>({ label, value, choices, onChange }: { label: string; value: T | ""; choices: { value: T; label: string }[]; onChange: (value: T) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-800">{label}</legend>
      <div className="mt-2 flex gap-2">
        {choices.map(choice => <button key={choice.value} type="button" aria-pressed={value === choice.value} onClick={() => onChange(choice.value)} className={`min-h-10 min-w-20 rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${value === choice.value ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{choice.label}</button>)}
      </div>
    </fieldset>
  );
}

function YesNoField({ label, icon: Icon, value, onChange }: { label: string; icon: typeof Smartphone; value: boolean | null; onChange: (value: boolean) => void }) {
  return (
    <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="flex items-center gap-2.5 text-sm font-medium text-slate-800"><Icon className="h-4 w-4 text-slate-500" />{label}</span>
      <div className="flex gap-2">
        {[{ value: true, label: "Yes" }, { value: false, label: "No" }].map(choice => <button key={choice.label} type="button" aria-pressed={value === choice.value} onClick={() => onChange(choice.value)} className={`min-h-10 min-w-16 rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${value === choice.value ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{choice.label}</button>)}
      </div>
    </div>
  );
}
