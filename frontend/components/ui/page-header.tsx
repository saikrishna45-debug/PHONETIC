import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Page title — rendered as an h1 */
  title: string;
  /** Optional subtitle/description */
  description?: string;
  /** Breadcrumb items — [{label, href?}] */
  breadcrumbs?: { label: string; href?: string }[];
  /** Right-side slot for CTAs */
  action?: React.ReactNode;
  /** Extra class on the wrapper */
  className?: string;
  /** Tag to override title element */
  as?: "h1" | "h2";
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  className,
  as: Tag = "h1",
}: PageHeaderProps) {
  return (
    <div className={cn("pb-6 mb-6 border-b border-slate-100", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-3" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.label}>
              {i > 0 && (
                <span className="text-slate-300 text-xs select-none">/</span>
              )}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-xs font-medium text-slate-800">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title + action row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Tag className="text-2xl font-bold text-slate-900 tracking-tight leading-tight truncate">
            {title}
          </Tag>
          {description && (
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
