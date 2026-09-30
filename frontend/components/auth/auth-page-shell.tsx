import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthPageShellProps {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  width?: "md" | "xl";
}

export function AuthPageShell({
  children,
  backHref = "/",
  backLabel = "Back to PHONETIC",
  width = "md",
}: AuthPageShellProps) {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-white via-emerald-50/40 to-sky-50/45 px-4 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-sky-100/45 blur-3xl" />
      <div className={`relative z-10 mx-auto flex w-full flex-1 flex-col ${width === "xl" ? "max-w-2xl" : "max-w-md"}`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="PHONETIC home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-lg font-black text-white shadow-sm">P</span>
            <span className="text-sm font-bold tracking-normal text-slate-950">PHONETIC</span>
          </Link>
          <Link href={backHref} className="inline-flex items-center gap-1.5 rounded-md py-2 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-center py-10 sm:py-14">{children}</div>
        <p className="pb-2 text-center text-xs text-slate-400">Your Smartphone. Your Smart Decision.</p>
      </div>
    </main>
  );
}
