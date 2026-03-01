import { useSuspenseQuery } from "@tanstack/react-query";
import { creditScoreQueryOptions } from "../lib/api/fake-api";
import { Card } from "./card";

export function CreditScore() {
  const { data: creditScore } = useSuspenseQuery(creditScoreQueryOptions);

  const getScoreCategory = (score: number) => {
    if (score >= 800) return { label: "Exceptional", color: "#059669" };
    if (score >= 740) return { label: "Excellent", color: "#16a34a" };
    if (score >= 670) return { label: "Good", color: "#0d9488" };
    if (score >= 580) return { label: "Fair", color: "#d97706" };
    return { label: "Poor", color: "#dc2626" };
  };

  const { label, color } = getScoreCategory(creditScore.score);

  // Calculate percentage for the arc
  const min = creditScore.scoreRange.min;
  const max = creditScore.scoreRange.max;
  const pct = ((creditScore.score - min) / (max - min)) * 100;

  return (
    <Card className="p-5">
      <div className="flex flex-col items-center">
        <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
          FICO® Score
        </div>
        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Score ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="#F5F0EB"
              strokeWidth="6"
            />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${pct * 2.64} 264`}
            />
          </svg>
          <div className="text-3xl font-bold font-display" style={{ color }}>
            {creditScore.score}
          </div>
        </div>
        <div
          className="mt-2 text-xs font-semibold tracking-wide uppercase"
          style={{ color }}
        >
          {label}
        </div>
        <div className="w-full flex justify-between text-[10px] text-stone-400 mt-3 px-4">
          <span>{creditScore.scoreRange.min}</span>
          <span>{creditScore.scoreRange.max}</span>
        </div>
        <div className="text-[10px] text-stone-400 mt-1">
          Updated {new Date(creditScore.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
}

export function CreditScoreSkeleton() {
  return (
    <Card>
      <div className="flex flex-col items-center p-4 animate-pulse">
        {/* FICO Score label */}
        <div className="h-[16px] w-20 bg-gray-200 rounded mb-1"></div>
        {/* Score circle */}
        <div className="relative w-24 h-24 rounded-full bg-gray-200"></div>
        {/* Score label */}
        <div className="h-[14px] w-16 bg-gray-200 rounded mt-1"></div>
        {/* Score range */}
        <div className="w-full flex justify-between mt-2">
          <div className="h-3 w-8 bg-gray-200 rounded"></div>
          <div className="h-3 w-8 bg-gray-200 rounded"></div>
        </div>
        {/* Updated date */}
        <div className="h-[12px] w-24 bg-gray-200 rounded mt-1"></div>
      </div>
    </Card>
  );
}
