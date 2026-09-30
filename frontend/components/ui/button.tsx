import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles shared by all buttons
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold",
    "transition-all duration-150 select-none cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-emerald-500",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Emerald primary — main CTA, "Get Started", "Predict Value" */
        default:
          "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 rounded-xl",
        /** Outlined — secondary CTA, "Explore Phonetic", "Back" */
        outline:
          "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 rounded-xl shadow-xs",
        /** Ghost — icon buttons, nav links */
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg",
        /** Destructive */
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm rounded-xl",
        /** Secondary — muted filled */
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg",
        /** Link — inline text link style */
        link: "text-emerald-600 underline-offset-4 hover:underline p-0 h-auto rounded-none",
        /** Brand soft — light-green tinted, used for "quick action" cards */
        soft: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 rounded-xl",
        /** Blue soft — secondary accent */
        "soft-blue":
          "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 rounded-xl",
      },
      size: {
        xs:      "h-7  px-3   text-[11px] rounded-lg",
        sm:      "h-8  px-4   text-xs",
        default: "h-10 px-5   text-sm",
        lg:      "h-12 px-7   text-base",
        xl:      "h-14 px-9   text-lg",
        icon:    "h-9  w-9    rounded-lg",
        "icon-sm":"h-7 w-7   rounded-md",
        "icon-lg":"h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
