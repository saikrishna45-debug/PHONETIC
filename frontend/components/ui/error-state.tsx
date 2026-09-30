import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  /** Compact — for inside cards */
  compact?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Try Again",
  className,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "rounded-2xl border border-red-100 bg-red-50/50",
        compact ? "py-8 px-6" : "py-14 px-8",
        className
      )}
    >
      <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="h-5 w-5 text-red-500" />
      </div>

      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>

      {description && (
        <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          className="mt-5 gap-1.5"
          onClick={onRetry}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
