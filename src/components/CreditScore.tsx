import { useSuspenseQuery } from "@tanstack/react-query";
import { creditScoreQueryOptions } from "../lib/api/fake-api";

export function CreditScore() {
  const { data: creditScore } = useSuspenseQuery(creditScoreQueryOptions);

  const getScoreCategory = (score: number) => {
    if (score >= 800) return { label: "Exceptional", color: "emerald" };
    if (score >= 740) return { label: "Excellent", color: "green" };
    if (score >= 670) return { label: "Good", color: "blue" };
    if (score >= 580) return { label: "Fair", color: "yellow" };
    return { label: "Poor", color: "red" };
  };

  const { label, color } = getScoreCategory(creditScore.score);

  return (
    <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="text-gray-600 mb-2">FICO® Score</div>
      <div className="relative flex items-center justify-center w-32 h-32">
        <div
          className={`absolute inset-0 bg-${color}-100 rounded-full animate-pulse opacity-20`}
        ></div>
        <div className={`text-4xl font-bold text-${color}-600`}>
          {creditScore.score}
        </div>
      </div>
      <div className={`mt-2 text-sm text-${color}-600 font-medium`}>
        {label}
      </div>
      <div className="w-full flex justify-between text-xs text-gray-400 mt-4">
        <span>{creditScore.scoreRange.min}</span>
        <span>{creditScore.scoreRange.max}</span>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Updated {new Date(creditScore.lastUpdated).toLocaleDateString()}
      </div>
    </div>
  );
}

export function CreditScoreSkeleton() {
  return (
    <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg bg-white shadow-sm animate-pulse">
      {/* Title placeholder */}
      <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>

      {/* Score circle placeholder */}
      <div className="relative flex items-center justify-center w-32 h-32">
        <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
      </div>

      {/* Category placeholder */}
      <div className="h-4 w-16 bg-gray-200 rounded mt-2"></div>

      {/* Range bar placeholder */}
      <div className="w-full flex justify-between mt-4">
        <div className="h-3 w-8 bg-gray-200 rounded"></div>
        <div className="h-3 w-8 bg-gray-200 rounded"></div>
      </div>

      {/* Date placeholder */}
      <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
    </div>
  );
}
