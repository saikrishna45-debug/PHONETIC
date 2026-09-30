import { MOCK_SELL_PHONE_CATALOG } from "@/data/phones";
import type { MockResalePrediction, SellPhoneFormData, SellPhoneResultPayload } from "@/types/resale";

const demoBrand = MOCK_SELL_PHONE_CATALOG.find(item => item.brand === "Samsung")!;
const demoModel = demoBrand.models.find(item => item.name === "Galaxy S23")!;
const demoVariant = demoModel.variants.find(item => item.label === "8GB / 256GB")!;

export const DEMO_SELL_PHONE_FORM: SellPhoneFormData = {
  brand: demoBrand.brand,
  model: demoModel.name,
  variant: demoVariant.label,
  usageDurationYears: "2",
  batteryHealth: 87,
  warranty: "no",
  condition: "good",
  screenCracks: false,
  majorScratches: false,
  previousRepair: false,
  originalBox: true,
  originalCharger: true,
};

export const MOCK_RESALE_PREDICTION: MockResalePrediction = {
  id: "demo-resale-prediction",
  estimatedValue: 32500,
  range: { min: 29500, max: 34000 },
  breakdown: [
    { name: "Device age", impact: "negative", explanation: "Used duration is considered in the demo estimate." },
    { name: "Battery health", impact: "positive", explanation: "Battery condition contributes to the estimated value." },
    { name: "Condition", impact: "neutral", explanation: "Cosmetic condition and reported damage are considered." },
    { name: "Storage", impact: "positive", explanation: "Higher-capacity variants can retain more resale value." },
    { name: "Original price", impact: "neutral", explanation: "Launch price provides context for the estimate." },
  ],
  generatedAt: "2026-09-28T00:00:00.000Z",
  isDemo: true,
};

export const DEMO_RESALE_RESULT: SellPhoneResultPayload = {
  form: DEMO_SELL_PHONE_FORM,
  prediction: MOCK_RESALE_PREDICTION,
};