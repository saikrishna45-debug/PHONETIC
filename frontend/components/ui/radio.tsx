import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return (
      <div className="flex items-start gap-3">
        <input
          type="radio"
          id={inputId}
          ref={ref}
          className={cn(
            "h-4 w-4 mt-0.5 border-slate-300 text-emerald-600",
            "focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0",
            "cursor-pointer",
            className
          )}
          {...props}
        />
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
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";

/**
 * RadioGroup — wraps a set of Radio inputs in a fieldset with optional legend.
 */
interface RadioGroupProps {
  legend?: string;
  children: React.ReactNode;
  className?: string;
  direction?: "vertical" | "horizontal";
}

function RadioGroup({ legend, children, className, direction = "vertical" }: RadioGroupProps) {
  return (
    <fieldset className={cn("space-y-0", className)}>
      {legend && (
        <legend className="text-xs font-semibold text-slate-700 mb-2">{legend}</legend>
      )}
      <div
        className={cn(
          direction === "horizontal" ? "flex flex-wrap gap-4" : "space-y-3"
        )}
      >
        {children}
      </div>
    </fieldset>
  );
}

export { Radio, RadioGroup };
