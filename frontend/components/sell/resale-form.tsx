"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PHONE_BRANDS, PHONE_CONDITIONS, STORAGE_OPTIONS, RAM_OPTIONS } from "@/lib/constants";
import { Tag } from "lucide-react";

export function ResaleForm() {
  const router = useRouter();
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("iPhone 13");
  const [storage, setStorage] = useState("128GB");
  const [ram, setRam] = useState("6GB");
  const [condition, setCondition] = useState("good");
  const [hasBox, setHasBox] = useState(true);
  const [hasCharger, setHasCharger] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      brand,
      model,
      storage,
      ram,
      condition,
      hasBox: String(hasBox),
      hasCharger: String(hasCharger),
    });
    router.push(`/app/sell/result?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Details</CardTitle>
        <CardDescription>
          Enter your smartphone details to get an accurate resale estimate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Brand
              </label>
              <select
                aria-label="Brand"
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {PHONE_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Model
              </label>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. iPhone 13, Galaxy S23"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Storage
              </label>
              <select
                aria-label="Storage"
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
              >
                {STORAGE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                RAM
              </label>
              <select
                aria-label="RAM"
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
              >
                {RAM_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Device Condition
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PHONE_CONDITIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                    condition === c.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  <span className="font-semibold block">{c.label}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block leading-snug">
                    {c.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-5 pt-1">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasBox}
                onChange={(e) => setHasBox(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Original box included
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCharger}
                onChange={(e) => setHasCharger(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Original charger included
            </label>
          </div>

          <Button type="submit" className="w-full sm:w-auto gap-2">
            <Tag className="h-4 w-4" />
            Predict Value
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
