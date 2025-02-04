import { useSuspenseQuery } from "@tanstack/react-query";
import { creditScoreQueryOptions } from "../lib/api/fake-api";
import { Card } from "./card";

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
    <Card>
      <div className="flex flex-col items-center">
        <div className="text-gray-600 text-sm mb-1 min-h-[16px]">
          FICO® Score
        </div>
        <div className="relative flex items-center justify-center w-24 h-24">
          <div
            className={`absolute inset-0 bg-${color}-100 rounded-full animate-pulse opacity-20`}
          ></div>
          <div className={`text-3xl font-bold text-${color}-600`}>
            {creditScore.score}
          </div>
        </div>
        <div
          className={`mt-1 text-xs text-${color}-600 font-medium min-h-[14px]`}
        >
          {label}
        </div>
        <div className="w-full flex justify-between text-xs text-gray-400 mt-2">
          <span>{creditScore.scoreRange.min}</span>
          <span>{creditScore.scoreRange.max}</span>
        </div>
        <div className="text-[10px] text-gray-400 mt-1 min-h-[12px]">
          Updated {new Date(creditScore.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
}

export function CreditScoreSkeleton() {
  return (
    <Card>
      <div className="flex flex-col items-center bg-white animate-pulse">
        {/* FICO Score - text-sm (14px * 1.5 = 21px) */}
        <div className="h-[21px] w-20 bg-gray-200 rounded mb-1"></div>

        {/* Main score circle */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 bg-gray-200 rounded-full opacity-20"></div>
          <div className="h-[45px] w-16 bg-gray-200 rounded"></div>
        </div>

        {/* Label - text-xs (12px * 1.5 = 18px) */}
        <div className="mt-1 h-[18px] w-16 bg-gray-200 rounded"></div>

        {/* Range numbers - text-xs (12px * 1.5 = 18px) */}
        <div className="w-full flex justify-between mt-2">
          <span className="h-[18px] w-8 bg-gray-200 rounded"></span>
          <span className="h-[18px] w-8 bg-gray-200 rounded"></span>
        </div>

        {/* Update text - text-[10px] (10px * 1.5 = 15px) */}
        <div className="h-[15px] w-24 bg-gray-200 rounded mt-1"></div>
      </div>
    </Card>
  );
}
