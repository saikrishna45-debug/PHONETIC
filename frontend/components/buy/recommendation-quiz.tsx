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
import { PRIMARY_USE_CASES, PHONE_BRANDS } from "@/lib/constants";
import { Search } from "lucide-react";
import { formatINR } from "@/lib/utils";

export function RecommendationQuiz() {
  const router = useRouter();
  const [budget, setBudget] = useState(40000);
  const [useCase, setUseCase] = useState("gaming");
  const [brands, setBrands] = useState<string[]>(["Samsung", "OnePlus", "Apple"]);
  const [needs5G, setNeeds5G] = useState(true);

  const toggleBrand = (brand: string) => {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSubmit = () => {
    const params = new URLSearchParams({
      budget: String(budget),
      useCase,
      brands: brands.join(","),
      needs5G: String(needs5G),
    });
    router.push(`/app/buy/results?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Your Perfect Phone</CardTitle>
        <CardDescription>
          Tell us your preferences and our AI engine will rank the best options for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700">
              Maximum Budget
            </label>
            <span className="text-sm font-bold text-emerald-600">
              {formatINR(budget)}
            </span>
          </div>
          <input
            type="range"
            min={5000}
            max={150000}
            step={1000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600 bg-slate-200"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>₹5,000</span>
            <span>₹1,50,000</span>
          </div>
        </div>

        {/* Primary usage */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            Primary Usage
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRIMARY_USE_CASES.map((uc) => (
              <button
                key={uc.id}
                type="button"
                onClick={() => setUseCase(uc.id)}
                className={`px-3 py-2.5 text-xs font-medium rounded-xl border text-left transition-all ${
                  useCase === uc.id
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                }`}
              >
                {uc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred brands */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            Preferred Brands
          </label>
          <div className="flex flex-wrap gap-2">
            {PHONE_BRANDS.map((brand) => {
              const selected = brands.includes(brand);
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selected
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5G toggle */}
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={needs5G}
            onChange={(e) => setNeeds5G(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          5G is required
        </label>

        <Button onClick={handleSubmit} className="w-full sm:w-auto gap-2">
          <Search className="h-4 w-4" />
          Get Recommendations
        </Button>
      </CardContent>
    </Card>
  );
}
