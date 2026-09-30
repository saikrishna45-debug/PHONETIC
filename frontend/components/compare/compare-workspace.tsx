"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, GitCompareArrows, Plus, Search, X } from "lucide-react";
import { MOCK_PHONES } from "@/data/phones";
import { explainPhoneMatch } from "@/lib/api/recommendations";
import type { Phone, RecommendationPreferences } from "@/types/index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PhoneImage } from "@/components/phones/phone-image";
import { formatINR } from "@/lib/utils";

const MAX_COMPARE = 3;

function phoneDisplayName(phone: Phone): string {
  return phone.model.toLocaleLowerCase().startsWith(phone.brand.toLocaleLowerCase())
    ? phone.model
    : `${phone.brand} ${phone.model}`;
}

interface CompareWorkspaceProps {
  initialPhoneIds: string[];
  preferences: RecommendationPreferences | null;
}

interface CompareRow {
  label: string;
  key: string;
  values: (phone: Phone) => { text: string; numeric?: number; favorable?: "high" | "low" };
}

const rows: CompareRow[] = [
  { label: "Price", key: "price", values: phone => ({ text: formatINR(phone.price), numeric: phone.price, favorable: "low" }) },
  { label: "RAM", key: "ram", values: phone => ({ text: phone.recommendationProfile ? `${phone.recommendationProfile.ramGb} GB` : phone.ram, numeric: phone.recommendationProfile?.ramGb }) },
  { label: "Storage", key: "storage", values: phone => ({ text: phone.recommendationProfile ? formatStorage(phone.recommendationProfile.storageGb) : phone.storage, numeric: phone.recommendationProfile?.storageGb }) },
  { label: "Battery", key: "battery", values: phone => ({ text: phone.recommendationProfile ? `${phone.recommendationProfile.batteryMah} mAh` : phone.battery, numeric: phone.recommendationProfile?.batteryMah }) },
  { label: "Refresh Rate", key: "refreshRate", values: phone => ({ text: phone.refreshRate, numeric: Number.parseInt(phone.refreshRate, 10) || undefined }) },
  { label: "Camera", key: "camera", values: phone => ({ text: phone.camera, numeric: phone.recommendationProfile?.cameraMp }) },
  { label: "Display", key: "display", values: phone => ({ text: phone.display }) },
  { label: "Processor", key: "processor", values: phone => ({ text: phone.processor }) },
  { label: "5G", key: "fiveG", values: phone => ({ text: phone.fiveG ? "Supported" : "Not supported", numeric: phone.fiveG ? 1 : 0 }) },
];

function formatStorage(gigabytes: number): string {
  return gigabytes >= 1024 ? `${gigabytes / 1024} TB` : `${gigabytes} GB`;
}

export function CompareWorkspace({ initialPhoneIds, preferences }: CompareWorkspaceProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => [...new Set(initialPhoneIds)].filter(id => MOCK_PHONES.some(phone => phone.id === id)).slice(0, MAX_COMPARE));
  const [search, setSearch] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedPhones = selectedIds.map(id => MOCK_PHONES.find(phone => phone.id === id)).filter((phone): phone is Phone => Boolean(phone));
  const query = search.trim().toLocaleLowerCase();
  const searchResults = query
    ? MOCK_PHONES
        .filter(phone => !selectedIds.includes(phone.id) && `${phone.brand} ${phone.model}`.toLocaleLowerCase().includes(query))
        .slice(0, 6)
    : [];
  const searchOverLimit = selectedIds.length >= MAX_COMPARE;

  function addPhone(id: string) {
    if (selectedIds.length >= MAX_COMPARE || selectedIds.includes(id)) return;
    setSelectedIds(current => [...current, id]);
    setIsComparing(false);
    setSearch("");
  }

  function removePhone(id: string) {
    setSelectedIds(current => current.filter(selectedId => selectedId !== id));
    setIsComparing(false);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 overflow-x-hidden sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Compare Phones</h1>
        <p className="mt-1 text-sm leading-6 text-slate-600">Compare smartphones side by side before making your decision.</p>
      </div>

      <section aria-labelledby="select-phones-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h2 id="select-phones-heading" className="text-lg font-bold text-slate-950">Choose phones to compare</h2><p className="mt-1 text-xs text-slate-500">Select two or three phones from the mock catalog.</p></div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{selectedIds.length} of {MAX_COMPARE} phones selected</span>
        </div>

        {selectedPhones.length === 0 && <EmptyState icon={GitCompareArrows} title="Start comparing smartphones" description="Select two or three phones to compare their specifications and compatibility." action={{ label: "Add Phones", onClick: () => searchRef.current?.focus() }} compact />}
        {selectedPhones.length === 1 && <p className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm text-sky-900">Add one more phone to compare.</p>}

        {selectedPhones.length > 0 && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selectedPhones.map(phone => <SelectedPhoneCard key={phone.id} phone={phone} onRemove={() => removePhone(phone.id)} />)}
        </div>}

        <div className="max-w-xl">
          <label htmlFor="compare-search" className="mb-1.5 block text-sm font-semibold text-slate-800">Search smartphones</label>
          <Input ref={searchRef} id="compare-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search smartphones..." aria-label="Search smartphones by brand or model" startIcon={<Search className="h-4 w-4" />} />
          {searchOverLimit && <p className="mt-1.5 text-xs font-medium text-slate-500">You can compare up to 3 phones.</p>}
          {search && <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" role="listbox" aria-label="Phone search results">
            {searchResults.length ? searchResults.map(phone => <button key={phone.id} type="button" role="option" aria-selected={false} disabled={searchOverLimit} onClick={() => addPhone(phone.id)} className="flex min-h-12 w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 text-left last:border-b-0 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"><span><span className="block text-sm font-semibold text-slate-800">{phone.brand} {phone.model}</span><span className="mt-0.5 block text-xs text-slate-500">{formatINR(phone.price)} · {phone.variant}</span></span><Plus className="h-4 w-4 shrink-0 text-emerald-700" /></button>) : <p className="px-4 py-3 text-sm text-slate-500">No available phones match that search.</p>}
          </div>}
        </div>

        <Button type="button" onClick={() => setIsComparing(true)} disabled={selectedPhones.length < 2} className="min-h-11 w-full sm:w-auto"><GitCompareArrows className="h-4 w-4" />Compare Phones</Button>
      </section>

      {isComparing && selectedPhones.length >= 2 && <>
        <ComparisonTable phones={selectedPhones} />
        {preferences ? <CompatibilityComparison phones={selectedPhones} preferences={preferences} /> : <Card className="border-sky-100 bg-sky-50/50 shadow-none"><CardContent className="flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center sm:p-5"><div><h2 className="text-base font-bold text-slate-900">Personalized comparison</h2><p className="mt-1 text-sm text-slate-600">Personalized comparison becomes available after setting your preferences.</p></div><Button asChild variant="outline"><Link href="/app/buy">Set Preferences<ArrowRight className="h-4 w-4" /></Link></Button></CardContent></Card>}
      </>}
      {selectedPhones.length === MAX_COMPARE && <p className="text-xs text-slate-500">You can compare up to 3 phones. Remove one to choose another.</p>}
    </div>
  );
}

function SelectedPhoneCard({ phone, onRemove }: { phone: Phone; onRemove: () => void }) {
  const displayName = phoneDisplayName(phone);
  return <Card className="relative overflow-hidden border-slate-200 shadow-none">
    <CardContent className="flex items-center gap-3 p-3">
      <PhoneImage model={phone.model} className="h-16 w-16 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{displayName}</p><p className="mt-1 truncate text-xs text-slate-500">{formatINR(phone.price)} · {phone.variant}</p></div>
      <button type="button" onClick={onRemove} aria-label={`Remove ${displayName}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><X className="h-4 w-4" /></button>
    </CardContent>
  </Card>;
}

function ComparisonTable({ phones }: { phones: Phone[] }) {
  const highlighted = new Map<string, Set<string>>();
  for (const row of rows) {
    const values = row.values(phones[0]);
    if (values.numeric === undefined) continue;
    const candidates = phones.map(phone => row.values(phone).numeric);
    if (candidates.some(value => value === undefined) || candidates.every(value => value === candidates[0])) continue;
    const direction = row.key === "price" ? "low" : "high";
    const best = direction === "low" ? Math.min(...candidates as number[]) : Math.max(...candidates as number[]);
    phones.forEach(phone => {
      if (row.values(phone).numeric === best) {
        const keys = highlighted.get(row.key) ?? new Set<string>();
        keys.add(phone.id);
        highlighted.set(row.key, keys);
      }
    });
  }

  return <section aria-labelledby="spec-comparison-heading" className="space-y-3"><div><h2 id="spec-comparison-heading" className="text-lg font-bold text-slate-950">Side-by-side specifications</h2><p className="mt-1 text-xs text-slate-500">Subtle emphasis indicates a higher spec or lower price, not an overall winner.</p></div><div className="overflow-x-auto rounded-xl border border-slate-200 bg-white overscroll-x-contain"><table className="w-full min-w-[660px] border-collapse text-left text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50"><th scope="col" className="sticky left-0 z-10 w-36 bg-slate-50 p-3 text-xs font-semibold uppercase text-slate-500 sm:w-44 sm:p-4">Specification</th>{phones.map(phone => <th scope="col" key={phone.id} className="min-w-44 p-3 align-top sm:p-4"><Badge variant="secondary" className="mb-2">{phone.brand}</Badge><p className="text-sm font-bold text-slate-900">{phone.model}</p><p className="mt-1 text-xs font-normal text-slate-500">{phone.variant}</p></th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map(row => <tr key={row.key}><th scope="row" className="sticky left-0 z-10 bg-white p-3 text-xs font-semibold text-slate-600 sm:p-4">{row.label}</th>{phones.map(phone => {const cell = row.values(phone); const isHighlighted = highlighted.get(row.key)?.has(phone.id); return <td key={phone.id} aria-label={isHighlighted ? `${cell.text}, comparatively favorable` : cell.text} className={`p-3 text-xs leading-5 text-slate-700 sm:p-4 ${isHighlighted ? "bg-emerald-50/70 font-semibold text-emerald-900" : ""}`}>{cell.text}</td>;})}</tr>)}</tbody></table></div></section>;
}

function CompatibilityComparison({ phones, preferences }: { phones: Phone[]; preferences: RecommendationPreferences }) {
  return <section aria-labelledby="compatibility-heading" className="space-y-3"><div><h2 id="compatibility-heading" className="text-lg font-bold text-slate-950">Compare based on your preferences</h2><p className="mt-1 text-xs text-slate-500">Each phone is evaluated against the same preference set. No overall winner is calculated.</p></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{phones.map(phone => {const explanation = explainPhoneMatch(phone, preferences); const profile = phone.recommendationProfile; const checks = [
    { label: "Budget fit", met: phone.price >= preferences.budgetMin && phone.price <= preferences.budgetMax },
    { label: "Performance fit", met: Boolean(profile && profile.performanceScore >= (preferences.performance === "very-high" ? 9 : preferences.performance === "high" ? 8 : preferences.performance === "medium" ? 6 : 0)) },
    { label: "Battery fit", met: Boolean(profile && profile.batteryScore >= (preferences.battery === "high" ? 8 : preferences.battery === "medium" ? 6 : 0)) },
    { label: "Camera fit", met: Boolean(profile && profile.cameraScore >= (preferences.camera === "high" ? 8 : preferences.camera === "medium" ? 6 : 0)) },
    { label: "Storage fit", met: Boolean(profile && profile.storageGb >= preferences.minStorage) },
    { label: "RAM fit", met: Boolean(profile && profile.ramGb >= preferences.minRam) },
  ]; return <Card key={phone.id} className="border-slate-200 shadow-none"><CardContent className="p-4"><div className="mb-3"><p className="text-sm font-bold text-slate-900">{phoneDisplayName(phone)}</p><p className="mt-1 text-xs text-slate-500">{formatINR(phone.price)}</p></div><ul className="space-y-2">{checks.map(check => <li key={check.label} className="flex items-center gap-2 text-xs"><span className={`flex h-4 w-4 items-center justify-center rounded-full ${check.met ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"}`}>{check.met ? <Check className="h-3 w-3" /> : <span className="text-[10px]">–</span>}</span><span className={check.met ? "text-slate-800" : "text-slate-500"}>{check.label}</span></li>)}</ul><div className="mt-4 border-t border-slate-100 pt-3"><p className="text-[10px] font-semibold uppercase text-emerald-800">Preference notes</p><p className="mt-1 text-xs leading-5 text-slate-600">{explanation.reasons[0] ?? "Balanced option for your selected preferences."}</p>{explanation.tradeoffs[0] && <p className="mt-1 text-xs leading-5 text-amber-800">{explanation.tradeoffs[0]}</p>}</div></CardContent></Card>;})}</div></section>;
}
