import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Single Skeleton block ───────────────────────────────────── */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

function Skeleton({ className, rounded = "md", ...props }: SkeletonProps) {
  const roundedMap = {
    sm:   "rounded",
    md:   "rounded-lg",
    lg:   "rounded-xl",
    xl:   "rounded-2xl",
    full: "rounded-full",
  };
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton", roundedMap[rounded], className)}
      {...props}
    />
  );
}

/* ── Pre-built composite skeletons ───────────────────────────── */

/** PhoneCard skeleton — matches PhoneCard layout */
function PhoneCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-16" rounded="full" />
        <Skeleton className="h-5 w-12" rounded="full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" rounded="md" />
        <Skeleton className="h-5 w-16" rounded="md" />
        <Skeleton className="h-5 w-16" rounded="md" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-16" rounded="xl" />
      </div>
    </div>
  );
}

/** StatCard skeleton */
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-10" rounded="xl" />
      </div>
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

/** Row skeleton — for table / list rows */
function RowSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white">
          <Skeleton className="h-9 w-9 shrink-0" rounded="xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, PhoneCardSkeleton, StatCardSkeleton, RowSkeleton };
