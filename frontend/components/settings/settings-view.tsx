"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Bell, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { MOCK_USER } from "@/data";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SETTINGS_STORAGE_KEY = "phonetic-local-settings";

type NotificationSettings = {
  productUpdates: boolean;
  recommendations: boolean;
  priceInsights: boolean;
};

const defaultNotifications: NotificationSettings = {
  productUpdates: false,
  recommendations: false,
  priceInsights: false,
};

const notificationOptions: { key: keyof NotificationSettings; label: string; description: string }[] = [
  { key: "productUpdates", label: "Product updates", description: "News about PHONETIC features and improvements." },
  { key: "recommendations", label: "Recommendation updates", description: "Updates related to your phone recommendations." },
  { key: "priceInsights", label: "Price insights", description: "Changes and insights for phones you follow." },
];

const SETTINGS_CHANGED_EVENT = "phonetic-settings-changed";
let cachedSerializedSettings: string | null | undefined;
let cachedNotifications = defaultNotifications;

function readNotifications(): NotificationSettings {
  if (typeof window === "undefined") return defaultNotifications;
  try {
    const serialized = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (serialized === cachedSerializedSettings) return cachedNotifications;
    if (!serialized) {
      cachedSerializedSettings = null;
      cachedNotifications = defaultNotifications;
      return cachedNotifications;
    }
    const parsed: unknown = JSON.parse(serialized);
    if (!parsed || typeof parsed !== "object") throw new Error("Invalid settings");
    const saved = parsed as Partial<NotificationSettings>;
    cachedNotifications = {
      productUpdates: typeof saved.productUpdates === "boolean" ? saved.productUpdates : defaultNotifications.productUpdates,
      recommendations: typeof saved.recommendations === "boolean" ? saved.recommendations : defaultNotifications.recommendations,
      priceInsights: typeof saved.priceInsights === "boolean" ? saved.priceInsights : defaultNotifications.priceInsights,
    };
    cachedSerializedSettings = serialized;
    return cachedNotifications;
  } catch {
    cachedSerializedSettings = null;
    cachedNotifications = defaultNotifications;
    return cachedNotifications;
  }
}

function subscribeNotifications(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", callback);
  window.addEventListener(SETTINGS_CHANGED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SETTINGS_CHANGED_EVENT, callback);
  };
}

function writeNotifications(notifications: NotificationSettings): boolean {
  try {
    const serialized = JSON.stringify(notifications);
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, serialized);
    cachedSerializedSettings = serialized;
    cachedNotifications = notifications;
    window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function SettingsView() {
  const notifications = useSyncExternalStore(subscribeNotifications, readNotifications, () => defaultNotifications);
  const [status, setStatus] = useState("");

  function updateNotification(key: keyof NotificationSettings, checked: boolean) {
    const saved = writeNotifications({ ...notifications, [key]: checked });
    setStatus(saved ? "Preference saved in this browser." : "Could not save this preference in the browser.");
  }

  return <div className="space-y-6 sm:space-y-8">
    <SectionHeader title="Settings" description="Manage your PHONETIC account links and local demo preferences." />

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserRound className="h-4 w-4 text-emerald-700" />Account</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{MOCK_USER.name}</p>
          <p className="mt-1 break-all text-sm text-slate-600">{MOCK_USER.email}</p>
          <p className="mt-2 text-xs text-slate-500">Demo account details</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="min-h-11"><Link href="/app/profile">Edit profile<ArrowRight className="h-4 w-4" /></Link></Button>
          <Button asChild variant="ghost" className="min-h-11"><Link href="/app/buy">Update preferences<ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </CardContent>
    </Card>

    <Card id="notifications">
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4 text-emerald-700" />Notifications</CardTitle></CardHeader>
      <CardContent>
        <div>
          <fieldset className="divide-y divide-slate-100">
            <legend className="sr-only">Notification preferences</legend>
            {notificationOptions.map(option => <label key={option.key} className="flex min-h-16 cursor-pointer items-center gap-4 py-4 first:pt-0 last:pb-0">
              <input
                type="checkbox"
                checked={notifications[option.key]}
                onChange={event => updateNotification(option.key, event.target.checked)}
                className="h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              />
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{option.label}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{option.description}</span></span>
            </label>)}
          </fieldset>
          {status && <p role="status" className="mt-3 text-sm text-emerald-800">{status}</p>}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">Choices save in this browser. No notification service is connected.</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-emerald-700" />Privacy &amp; data</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">Notification preferences are stored in this browser. Profile and activity details shown in this demo use mock data. Data export and account deletion are not available here.</p>
        <p className="mt-3 text-xs text-slate-500">Clearing browser site data removes the local notification preferences and saved-phone list.</p>
      </CardContent>
    </Card>

    <Card className="border-slate-200">
      <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><h2 className="text-sm font-semibold text-slate-900">Log out</h2><p className="mt-1 text-xs leading-5 text-slate-600">This demo returns to the PHONETIC home page; no authentication session is connected.</p></div>
        <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto"><Link href="/"><LogOut className="h-4 w-4" />Log out</Link></Button>
      </CardContent>
    </Card>
  </div>;
}