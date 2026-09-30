import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Tag, Smartphone, GitCompareArrows } from "lucide-react";

const QUICK_ACTIONS = [
  {
    title: "Sell My Phone",
    description: "Know your phone's estimated value.",
    cta: "Get Estimate",
    href: "/app/sell",
    icon: Tag,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  {
    title: "Find My Phone",
    description: "Find a smartphone that fits you.",
    cta: "Find Phone",
    href: "/app/buy",
    icon: Smartphone,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Compare Smartphones",
    description: "Compare specifications, prices and personalized matches.",
    cta: "Compare Phones",
    href: "/app/compare",
    icon: GitCompareArrows,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-700",
  },
];

export function DashboardQuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.title} href={action.href} className="group">
            <Card className={`h-full border border-slate-200/80 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md ${action.title === "Compare Smartphones" ? "md:col-span-2" : ""}`}>
              <CardContent className={`flex h-full items-start justify-between p-5 sm:p-6 ${action.title === "Compare Smartphones" ? "md:items-center" : ""}`}>
                <div className="flex-1 min-w-0 pr-4">
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${action.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${action.iconColor}`} />
                  </div>
                  <h4 className="text-base font-bold text-slate-950 transition-colors group-hover:text-emerald-700">
                    {action.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {action.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    {action.cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700" aria-hidden="true">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
