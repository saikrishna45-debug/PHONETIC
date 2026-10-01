import { MOCK_PHONES, MOCK_SELL_PHONE_CATALOG } from "@/data/phones";
import { ApiError, apiClient } from "@/lib/api/client";
import { APP_CONFIG } from "@/lib/constants";
import type { PhoneCondition, ResaleModelRequest, ResaleModelResponse, SellPhoneFormData } from "@/types/resale";

export class ResaleApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ResaleApiError";
  }
}

function toResaleApiRequest(form: SellPhoneFormData): ResaleModelRequest {
  const brand = MOCK_SELL_PHONE_CATALOG.find(item => item.brand === form.brand);
  const model = brand?.models.find(item => item.name === form.model);
  const variant = model?.variants.find(item => item.label === form.variant);
  const phone = MOCK_PHONES.find(item => item.brand === form.brand && item.model === form.model);

  if (!variant || !phone) {
    throw new ResaleApiError("This phone is missing catalog specifications needed for a resale estimate.");
  }

  const ramGb = Number(variant.label.match(/^(\d+)\s*GB/i)?.[1]);
  const storageGb = Number(variant.storage.match(/^(\d+)\s*GB/i)?.[1]);
  const displayHz = Number(phone.refreshRate.match(/^(\d+)/)?.[1]);
  const cameraMp = Number(phone.camera.match(/(\d+(?:\.\d+)?)\s*MP/i)?.[1]);
  const ageYears = Number(form.usageDurationYears);

  if (![ramGb, storageGb, displayHz, cameraMp, ageYears].every(Number.isFinite)) {
    throw new ResaleApiError("Selected phone details are incomplete. Please review the device information.");
  }

  if (!form.condition) {
    throw new ResaleApiError("Please choose the condition that best describes your phone.");
  }

  const conditionNames: Record<PhoneCondition, string> = {
    like_new: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
  };

  return {
    launch_price_inr: variant.originalPrice,
    launch_year: phone.launchYear,
    age_years: ageYears,
    ram_gb: ramGb,
    storage_gb: storageGb,
    display_hz: displayHz,
    battery_health_pct: form.batteryHealth,
    camera_mp: cameraMp,
    brand: phone.brand,
    model: phone.model,
    processor: phone.processor.replace(/^(Apple|Google)\s+/i, ""),
    condition: conditionNames[form.condition],
    screen_crack: form.screenCracks ? "Yes" : "No",
    scratches: form.majorScratches ? "Heavy" : "Minor",
    box: form.originalBox ? "Yes" : "No",
    charger: form.originalCharger ? "Yes" : "No",
    invoice: "Unknown",
    warranty: form.warranty === "yes" ? "Yes" : "No",
    network: phone.fiveG ? "5G" : "4G",
    repair_history: form.previousRepair ? "Unknown" : "No Repairs",
    seller_type: "Individual",
  };
}

function backendApiRoot(): string {
  return APP_CONFIG.apiBaseUrl.replace(/\/api\/v1\/?$/, "");
}

export async function predictResaleValue(form: SellPhoneFormData): Promise<ResaleModelResponse> {
  const request = toResaleApiRequest(form);

  try {
    return await apiClient<ResaleModelResponse>("/api/resale/predict", {
      baseUrl: backendApiRoot(),
      method: "POST",
      body: JSON.stringify(request),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 422) {
        throw new ResaleApiError("Some device details were not accepted. Please review your entries.", error.status);
      }
      if (error.status === 503) {
        throw new ResaleApiError("The resale prediction service is temporarily unavailable. Please try again shortly.", error.status);
      }
      if (error.status >= 500) {
        throw new ResaleApiError("We could not generate a resale estimate right now. Please try again.", error.status);
      }
      throw new ResaleApiError("The resale request could not be completed. Please try again.", error.status);
    }

    if (error instanceof TypeError) {
      throw new ResaleApiError("Cannot reach the resale prediction service. Check that the backend is running and try again.");
    }

    if (error instanceof ResaleApiError) throw error;
    throw new ResaleApiError("We could not generate a resale estimate right now. Please try again.");
  }
}