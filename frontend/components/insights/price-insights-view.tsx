"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, BarChart3, Search, TrendingDown } from "lucide-react";
import { MOCK_PHONES } from "@/data/phones";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PhoneImage } from "@/components/phones/phone-image";
import { formatINR, calcDepreciation } from "@/lib/utils";

export function PriceInsightsView() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return MOCK_PHONES.filter(phone => `${phone.brand} ${phone.model}`.toLowerCase().includes(normalized)).slice(0, 6);
  }, [query]);
  const selectedPhone = MOCK_PHONES.find(phone => phone.id === selectedId);
  const depreciation = selectedPhone ? calcDepreciation(selectedPhone.launchPrice, selectedPhone.currentPrice) : 0;
  const chartData = selectedPhone ? [
    { label: "Launch price", value: selectedPhone.launchPrice },
    { label: "Current price", value: selectedPhone.currentPrice },
  ] : [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Price Insights</h1>
        <p className="mt-1 text-sm leading-6 text-slate-600">Explore the pricing information available for phones in the PHONETIC catalog.</p>
      </div>
      <div className="relative max-w-xl">
        <label htmlFor="insights-phone-search" className="mb-1.5 block text-sm font-semibold text-slate-800">Search smartphones</label>
        <Input id="insights-phone-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by brand or model..." aria-label="Search smartphones for price insights" startIcon={<Search className="h-4 w-4" />} />
        {query && <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg" role="listbox" aria-label="Phone search results">
          {matches.length ? matches.map(phone => <button type="button" role="option" aria-selected={selectedId === phone.id} key={phone.id} onClick={() => { setSelectedId(phone.id); setQuery(`${phone.brand} ${phone.model}`); }} className="flex min-h-12 w-full items-center justify-between border-b border-slate-100 px-4 py-2.5 text-left last:border-0 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600"><span><span className="block text-sm font-semibold text-slate-800">{phone.brand} {phone.model}</span><span className="text-xs text-slate-500">{formatINR(phone.currentPrice)}</span></span><ArrowRight className="h-4 w-4 text-emerald-700" /></button>) : <p className="px-4 py-3 text-sm text-slate-500">No phones found in the catalog.</p>}
        </div>}
      </div>

      {!selectedPhone ? <EmptyState icon={BarChart3} title="Choose a smartphone to explore" description="Search the catalog to see the launch and current prices available for a phone." /> : <>
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-slate-200 shadow-none"><CardContent className="flex items-center gap-4 p-5 sm:p-6"><PhoneImage model={selectedPhone.model} className="h-24 w-24 shrink-0 rounded-xl" priority /><div className="min-w-0"><div className="flex flex-wrap gap-2"><Badge variant="secondary">{selectedPhone.brand}</Badge>{selectedPhone.fiveG && <Badge variant="blue">5G</Badge>}</div><h2 className="mt-2 truncate text-xl font-bold text-slate-950">{selectedPhone.model}</h2><p className="mt-1 text-xs text-slate-500">{selectedPhone.variant}</p><Link href={`/app/phone/${selectedPhone.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline">View details<ArrowRight className="h-3 w-3" /></Link></div></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><TrendingDown className="h-4 w-4 text-emerald-700" />Price overview</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-3 pt-0 sm:grid-cols-3"><Metric label="Launch price" value={formatINR(selectedPhone.launchPrice)} /><Metric label="Current price" value={formatINR(selectedPhone.currentPrice)} /><Metric label="Depreciation" value={`${depreciation}%`} /></CardContent></Card>
        </section>
        <Card><CardHeader><CardTitle className="text-base">Available price comparison</CardTitle><p className="text-xs text-slate-500">This compares catalog launch and current prices. No historical trend data is available for this phone.</p></CardHeader><CardContent className="h-64 pt-0"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 12, right: 12, left: 8, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} /><XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={value => `₹${Math.round(Number(value) / 1000)}k`} /><Tooltip formatter={value => typeof value === "number" ? formatINR(value) : "Not available"} /><Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card className="border-sky-100 bg-sky-50/50 shadow-none"><CardContent className="p-5"><h2 className="text-base font-bold text-slate-950">What the available data tells us</h2><p className="mt-2 text-sm leading-6 text-slate-700">The catalog lists this phone at {formatINR(selectedPhone.launchPrice)} at launch and {formatINR(selectedPhone.currentPrice)} currently, a calculated difference of {formatINR(selectedPhone.launchPrice - selectedPhone.currentPrice)} ({depreciation}% depreciation).</p><p className="mt-2 text-xs text-slate-500">Used-price and historical market data are not available in the current mock dataset.</p></CardContent></Card>
      </>}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 px-3 py-3"><p className="text-[10px] font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm font-bold text-slate-900">{value}</p></div>;
}
