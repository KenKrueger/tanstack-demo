import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { TransferForm } from "../../components/forms/transfer-form";
import { ArrowLeftRight, Shield, Clock, Zap } from "lucide-react";

export const Route = createFileRoute("/move-money/transfer")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Make a Transfer" }] }),
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      {/* Transfer hero */}
      <div className="bg-stone-800 rounded-2xl p-6 text-white card-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <ArrowLeftRight size={20} className="text-amber-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-display">Transfer Money</h2>
            <p className="text-sm text-stone-300">Move funds between your accounts</p>
          </div>
        </div>
      </div>

      {/* Transfer form card */}
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <Suspense
          fallback={
            <div className="space-y-4 animate-pulse">
              <div className="h-5 w-28 bg-stone-100 rounded" />
              <div className="h-11 w-full bg-stone-100 rounded-lg" />
              <div className="h-5 w-24 bg-stone-100 rounded" />
              <div className="h-11 w-full bg-stone-100 rounded-lg" />
              <div className="h-5 w-20 bg-stone-100 rounded" />
              <div className="h-11 w-full bg-stone-100 rounded-lg" />
              <div className="h-11 w-28 bg-stone-100 rounded-lg" />
            </div>
          }
        >
          <TransferForm accountId="chk_1234" />
        </Suspense>
      </div>

      {/* Transfer info */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 text-center card-shadow">
          <Shield size={18} className="mx-auto text-emerald-600 mb-1.5" />
          <p className="text-xs font-medium text-stone-600">Secure</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center card-shadow">
          <Zap size={18} className="mx-auto text-amber-600 mb-1.5" />
          <p className="text-xs font-medium text-stone-600">Instant</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center card-shadow">
          <Clock size={18} className="mx-auto text-stone-500 mb-1.5" />
          <p className="text-xs font-medium text-stone-600">No Fees</p>
        </div>
      </div>
    </div>
  );
}
