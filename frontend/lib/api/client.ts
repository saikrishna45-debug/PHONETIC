import { APP_CONFIG } from "@/lib/constants";

export interface ApiClientOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  baseUrl?: string;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Base HTTP client for calling the FastAPI backend.
 * Callers decide how to present typed ApiError failures to users.
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { params, headers, baseUrl = APP_CONFIG.apiBaseUrl, ...rest } = options;

  let url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) qs.append(k, String(v));
    });
    const queryString = qs.toString();
    if (queryString) url += (url.includes("?") ? "&" : "?") + queryString;
  }

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
    ...rest,
  });

  if (!res.ok) {
    let errorData: unknown;
    try { errorData = await res.json(); } catch { errorData = await res.text(); }
    throw new ApiError(`API ${res.status}`, res.status, errorData);
  }

  return (await res.json()) as T;
}
