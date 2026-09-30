import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Progress ────────────────────────────────────────────────── */
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;           // 0–100
  max?: number;
  variant?: "default" | "success" | "warning" | "danger" | "blue";
  size?: "xs" | "sm" | "md";
  showLabel?: boolean;
  animated?: boolean;
}

const variantColor = {
  default: "bg-emerald-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger:  "bg-red-500",
  blue:    "bg-blue-500",
};

const sizeHeight = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
};

function Progress({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  animated = false,
  className,
  ...props
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full space-y-1", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-xs font-semibold text-slate-700">{Math.round(pct)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-100",
          sizeHeight[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantColor[variant],
            animated && "animate-pulse"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export { Progress };
