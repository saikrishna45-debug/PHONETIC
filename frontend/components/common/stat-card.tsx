import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  changeLabel?: string;
  changePercent?: number;   // positive = up, negative = down
  icon: LucideIcon;
  iconColor?: string;       // Tailwind text-* class
  iconBg?: string;          // Tailwind bg-* class
  className?: string;
}

export function StatCard({
  title,
  value,
  changeLabel,
  changePercent,
  icon: Icon,
  iconColor = "text-emerald-600",
  iconBg = "bg-emerald-50",
  className,
}: StatCardProps) {
  const isPositive = changePercent !== undefined && changePercent >= 0;

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          </div>
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>

        {changeLabel && (
          <div
            className={cn(
              "flex items-center gap-1 mt-3 text-xs font-semibold",
              isPositive ? "text-emerald-600" : "text-red-500"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {changeLabel}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
