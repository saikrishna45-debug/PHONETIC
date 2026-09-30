export interface MarketTrendOverview {
  brand: string;
  oneYearDepreciationRate: number; // percentage loss
  bestSellingSegment: string;
  averageResaleRetention: number; // percentage retained
}

export const MOCK_MARKET_TRENDS: MarketTrendOverview[] = [
  {
    brand: "Apple",
    oneYearDepreciationRate: 22,
    bestSellingSegment: "Pro / Pro Max",
    averageResaleRetention: 78,
  },
  {
    brand: "Samsung",
    oneYearDepreciationRate: 35,
    bestSellingSegment: "Ultra / A-series",
    averageResaleRetention: 65,
  },
  {
    brand: "Google",
    oneYearDepreciationRate: 40,
    bestSellingSegment: "Pro",
    averageResaleRetention: 60,
  },
  {
    brand: "OnePlus",
    oneYearDepreciationRate: 42,
    bestSellingSegment: "Number Series",
    averageResaleRetention: 58,
  },
];

export const MOCK_RESALE_PREDICTION_SAMPLE = {
  id: "resale-pred-101",
  predictedValue: 780,
  currency: "USD",
  confidenceScore: 0.94,
  priceRange: {
    min: 740,
    max: 820,
  },
  depreciationForecast: [
    { period: "Current", estimatedValue: 780 },
    { period: "+3 Months", estimatedValue: 730 },
    { period: "+6 Months", estimatedValue: 675 },
    { period: "+12 Months", estimatedValue: 580 },
  ],
  featureImportance: [
    {
      feature: "Battery Health (>85%)",
      impact: "positive" as const,
      description: "Well-maintained battery capacity keeps value near peak",
      percentageImpact: 14,
    },
    {
      feature: "Flawless Screen",
      impact: "positive" as const,
      description: "Zero micro-scratches adds $60-80 over average listings",
      percentageImpact: 12,
    },
    {
      feature: "Device Age (18 Months)",
      impact: "negative" as const,
      description: "Typical model life cycle discount",
      percentageImpact: -18,
    },
    {
      feature: "Missing Original Charger",
      impact: "negative" as const,
      description: "Minor deduction for third-party cable replacement",
      percentageImpact: -4,
    },
  ],
  recommendationTips: [
    "Selling within the next 45 days is optimal before the next major flagship announcement.",
    "Providing the original packaging can increase your buyer conversion rate by ~25%.",
  ],
  createdAt: new Date().toISOString(),
};
