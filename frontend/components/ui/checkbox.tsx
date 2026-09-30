import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).slice(2, 8)}`;
    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center mt-0.5">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            className={cn(
              "h-4 w-4 rounded border-slate-300 text-emerald-600",
              "focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0",
              "cursor-pointer transition-colors",
              error && "border-red-400",
              className
            )}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                htmlFor={inputId}
                className="text-sm font-medium text-slate-800 cursor-pointer select-none"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
