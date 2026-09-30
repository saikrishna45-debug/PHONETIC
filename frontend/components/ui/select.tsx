import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, placeholder, children, ...props }, ref) => (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full appearance-none rounded-xl border bg-white px-3 py-2 pr-9",
          "text-sm text-slate-900 cursor-pointer",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20",
          className
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {/* Custom chevron — overrides the ugly browser default */}
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
    </div>
  )
);
Select.displayName = "Select";

export { Select };
