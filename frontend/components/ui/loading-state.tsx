import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  /** Fill the full page height */
  fullPage?: boolean;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  size = "md",
  fullPage = false,
  className,
}: LoadingStateProps) {
  const iconSize = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };
  const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullPage ? "min-h-[60vh]" : "py-12",
        className
      )}
    >
      <div className="relative">
        <div className={cn("rounded-full bg-emerald-50 p-3")}>
          <Loader2
            className={cn("text-emerald-600 animate-spin", iconSize[size])}
          />
        </div>
      </div>
      {message && (
        <p className={cn("font-medium text-slate-500", textSize[size])}>
          {message}
        </p>
      )}
    </div>
  );
}
