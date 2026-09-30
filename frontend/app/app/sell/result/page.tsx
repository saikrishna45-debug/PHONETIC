import { Suspense } from "react";
import { ResaleResult } from "@/components/sell/resale-result";

export default function ResaleResultPage() {
  return <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Preparing your demo estimate...</div>}>
    <ResaleResult />
  </Suspense>;
}
