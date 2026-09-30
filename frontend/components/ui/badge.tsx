import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors",
  {
    variants: {
      variant: {
        /** Default — emerald brand */
        default:     "bg-emerald-100 text-emerald-700 border border-emerald-200",
        /** Success — same as default visually, semantic alias */
        success:     "bg-emerald-50  text-emerald-700 border border-emerald-200",
        /** Secondary — neutral slate */
        secondary:   "bg-slate-100   text-slate-700   border border-slate-200",
        /** Outline — white with border */
        outline:     "bg-white       text-slate-700   border border-slate-200",
        /** Blue — soft blue accent */
        blue:        "bg-blue-50     text-blue-700    border border-blue-200",
        /** Violet — for comparison highlights */
        violet:      "bg-violet-50   text-violet-700  border border-violet-200",
        /** Amber / warning */
        warning:     "bg-amber-50    text-amber-700   border border-amber-200",
        /** Red / error */
        destructive: "bg-red-50      text-red-700     border border-red-200",
        /** Dark — navy filled, for "tag" labels */
        dark:        "bg-slate-800   text-white",
        /** Premium — for user plan label */
        premium:     "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0",
      },
      size: {
        sm:      "text-[10px] px-2   py-0.5",
        default: "text-xs    px-2.5 py-0.5",
        lg:      "text-sm    px-3   py-1",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
