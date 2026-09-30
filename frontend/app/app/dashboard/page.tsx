"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { StatCard } from "@/components/common/stat-card";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_ACTIVITY, MOCK_USER } from "@/data";
import { getInitialSavedPhoneIds, readSavedPhoneIds, subscribeSavedPhoneIds } from "@/lib/saved-phones";
import type { ActivityItem } from "@/types";
import { Activity, ArrowRight, BookmarkCheck, Clock3, GitCompareArrows, Search, Smartphone, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const activityPresentation: Record<ActivityItem["type"], { icon: LucideIcon; color: string; background: string; href: string }> = {
  resale_prediction: { icon: Tag, color: "text-emerald-700", background: "bg-emerald-50", href: "/app/sell/result" },
  recommendation: { icon: Search, color: "text-blue-700", background: "bg-blue-50", href: "/app/buy/results" },
  comparison: { icon: GitCompareArrows, color: "text-violet-700", background: "bg-violet-50", href: "/app/compare" },
  saved_phone: { icon: BookmarkCheck, color: "text-amber-700", background: "bg-amber-50", href: "/app/saved" },
};

export default function DashboardPage() {
  const savedPhoneIds = useSyncExternalStore(subscribeSavedPhoneIds, readSavedPhoneIds, getInitialSavedPhoneIds);
  const predictionCount = MOCK_ACTIVITY.filter(item => item.type === "resale_prediction").length;
  const recommendationCount = MOCK_ACTIVITY.filter(item => item.type === "recommendation").length;
  const comparisonCount = MOCK_ACTIVITY.filter(item => item.type === "comparison").length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-800">Your day, made a little clearer</p>
          <h1 className="text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">
            Good evening, {MOCK_USER.name} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            What would you like to do today?
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-medium text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Your Phonetic workspace
        </span>
      </section>

      <DashboardQuickActions />

      <section aria-labelledby="activity-stats-heading">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 id="activity-stats-heading" className="text-lg font-bold text-slate-950">Your Activity</h2>
            <p className="mt-1 text-xs text-slate-500">Demo account activity</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">DEMO</span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          title="Predictions"
          value={predictionCount}
          icon={Tag}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <StatCard
          title="Recommendation sessions"
          value={recommendationCount}
          icon={Smartphone}
          iconBg="bg-sky-50"
          iconColor="text-sky-700"
        />
        <StatCard
          title="Saved Phones"
          value={savedPhoneIds.length}
          icon={BookmarkCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <StatCard
          title="Comparisons"
          value={comparisonCount}
          icon={Activity}
          iconBg="bg-sky-50"
          iconColor="text-sky-700"
        />
        </div>
      </section>

      <RecentActivity />
    </div>
  );
}

function RecentActivity() {
  return (
    <section aria-labelledby="recent-activity-heading">
      <div className="mb-4">
        <h2 id="recent-activity-heading" className="text-lg font-bold text-slate-950">Recent Activity</h2>
        <p className="mt-1 text-xs text-slate-500">A glimpse at your recent phone decisions</p>
      </div>
      <Card>
        <CardContent className="divide-y divide-slate-100 p-0">
          {MOCK_ACTIVITY.map(item => {
            const presentation = activityPresentation[item.type];
            const Icon = presentation.icon;
            return <Link key={item.id} href={presentation.href} className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:gap-4 sm:px-5">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${presentation.background} ${presentation.color}`}><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p></div>
              <span className="shrink-0 text-right text-[11px] text-slate-500"><Clock3 className="mr-1 inline h-3 w-3" />{item.timestamp}<ArrowRight className="ml-1 inline h-3 w-3" /></span>
            </Link>;
          })}
        </CardContent>
      </Card>
      <p className="mt-2 text-[11px] text-slate-400">Demo activity from the shared history list.</p>
    </section>
  );
}
