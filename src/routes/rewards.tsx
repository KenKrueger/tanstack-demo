import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "../components/card";
import { RouteHeroHeader } from "../components/route-hero-header";
import { GiftIcon, TagIcon, CreditCardIcon, UserIcon } from "lucide-react";

const mockRewards = {
  creditCardPoints: 12450,
  cashBackEarned: 124.5,
  recentActivity: [
    { date: "2024-03-15", description: "Restaurant Purchase", points: 150 },
    { date: "2024-03-14", description: "Gas Station", points: 75 },
    { date: "2024-03-12", description: "Grocery Store", points: 225 },
  ],
  memberPerks: [
    { title: "Free ATM Access", description: "No fees at 60,000+ ATMs" },
    {
      title: "No Monthly Fees",
      description: "Zero maintenance fees on checking",
    },
    {
      title: "High-Yield Savings",
      description: "4.25% APY on savings accounts",
    },
  ],
  offers: [
    {
      title: "2x Points",
      description: "On all dining purchases",
      expires: "March 31",
    },
    {
      title: "5% Cash Back",
      description: "At home improvement stores",
      expires: "April 15",
    },
  ],
};

export const Route = createFileRoute("/rewards")({
  component: RewardsPage,
});

function RewardsPage() {
  return (
    <>
      <RouteHeroHeader
        title="Rewards"
        subtitle="Points, perks, and offers"
        theme="rewards"
      />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">
                {mockRewards.creditCardPoints.toLocaleString()}
              </h2>
              <div className="text-sm text-zinc-500">Available Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                ${mockRewards.cashBackEarned.toFixed(2)}
              </div>
              <div className="text-sm text-zinc-500">Cash Back Earned</div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TagIcon className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Current Offers</h2>
            </div>
            <div className="space-y-4">
              {mockRewards.offers.map((offer, i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="font-medium">{offer.title}</div>
                  <div className="text-sm text-zinc-500">
                    {offer.description}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Expires {offer.expires}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Member Benefits</h2>
            </div>
            <div className="space-y-4">
              {mockRewards.memberPerks.map((perk, i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="font-medium">{perk.title}</div>
                  <div className="text-sm text-zinc-500">
                    {perk.description}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCardIcon className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="divide-y">
            {mockRewards.recentActivity.map((activity, i) => (
              <div key={i} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{activity.description}</div>
                  <div className="text-sm text-zinc-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  +{activity.points} pts
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
