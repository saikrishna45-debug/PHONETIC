"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, ArrowRight, Bookmark, Search, Tag } from "lucide-react";
import { MOCK_ACTIVITY } from "@/data/index";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type HistoryFilter = "all" | "resale_prediction" | "recommendation" | "comparison" | "saved_phone";
const filters: { id: HistoryFilter; label: string }[] = [
  { id: "all", label: "All" }, { id: "resale_prediction", label: "Resale" }, { id: "recommendation", label: "Recommendations" }, { id: "comparison", label: "Comparisons" }, { id: "saved_phone", label: "Saved" },
];
const meta = {
  resale_prediction: { icon: Tag, color: "text-emerald-700", bg: "bg-emerald-50", href: "/app/sell/result" },
  recommendation: { icon: Search, color: "text-blue-700", bg: "bg-blue-50", href: "/app/buy/results" },
  comparison: { icon: ArrowLeftRight, color: "text-violet-700", bg: "bg-violet-50", href: "/app/compare" },
  saved_phone: { icon: Bookmark, color: "text-amber-700", bg: "bg-amber-50", href: "/app/saved" },
};

export function HistoryView() {
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const activities = filter === "all" ? MOCK_ACTIVITY : MOCK_ACTIVITY.filter(item => item.type === filter);
  return <div className="space-y-6 sm:space-y-8">
    <div><h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">My History</h1><p className="mt-1 text-sm leading-6 text-slate-600">Review your recent resale predictions, recommendations, comparisons, and saved phones.</p></div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="History filters">{filters.map(item => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`min-h-10 rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${filter === item.id ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{item.label}</button>)}</div>
    {activities.length ? <Card><CardContent className="divide-y divide-slate-100 p-0">{activities.map(item => { const itemMeta = meta[item.type]; const Icon = itemMeta.icon; return <div key={item.id} className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${itemMeta.bg}`}><Icon className={`h-4 w-4 ${itemMeta.color}`} /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p></div><div className="flex shrink-0 flex-col items-end gap-1"><span className="text-[11px] text-slate-400">{item.timestamp}</span><Link href={itemMeta.href} aria-label={`View ${item.title}`} className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:underline">View<ArrowRight className="h-3 w-3" /></Link></div></div>; })}</CardContent></Card> : <EmptyState icon={Search} title="No activity in this view" description="Try another filter or continue using PHONETIC to build your history." />}
  </div>;
}
