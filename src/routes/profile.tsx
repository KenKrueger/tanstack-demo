import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "../components/card";
import { PageHeader } from "../components/page-header";
import { profileQueryOptions } from "../lib/api/fake-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  TabHistoryMode,
  setTabHistoryMode,
  useTabHistoryMode,
} from "../lib/tab-history-mode";
import { haptic } from "../lib/haptic";

export const Route = createFileRoute("/profile")({
  component: ProfilePageWrapper,
  loader: (opts) => {
    opts.context.queryClient.prefetchQuery(profileQueryOptions);
  },
  head: () => ({
    meta: [{ title: "Profile" }],
  }),
});

function ProfilePageWrapper() {
  return (
    <>
      <PageHeader title="Profile" />
      <div className="max-w-2xl mx-auto p-4">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent />
        </Suspense>
      </div>
    </>
  );
}

function ProfileContent() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-semibold">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              {profile.name}
            </h2>
            <p className="text-sm text-zinc-500">Member since 2022</p>
          </div>
        </div>
      </Card>

      <Card className="divide-y">
        <Section title="Personal Information">
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Phone" value={profile.phone} />
          <InfoRow label="Address" value={profile.address} />
        </Section>
      </Card>

      <Card className="divide-y">
        <Section title="Notification Preferences">
          <ToggleRow label="Email notifications" enabled={profile.notifications.email} />
          <ToggleRow label="Push notifications" enabled={profile.notifications.push} />
          <ToggleRow label="SMS notifications" enabled={profile.notifications.sms} />
        </Section>
      </Card>

      <Card className="divide-y">
        <Section title="Security">
          <InfoRow label="Last login" value="March 15, 2024" />
          <InfoRow label="Two-factor auth" value="Enabled" />
          <InfoRow label="Member since" value="2022" />
        </Section>
      </Card>

      <Card className="divide-y">
        <Section title="Navigation">
          <TabHistoryModeRow />
        </Section>
      </Card>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </Card>

      <Card className="divide-y animate-pulse">
        <div className="p-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="text-sm font-medium text-zinc-900">{value}</div>
    </div>
  );
}

function ToggleRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium text-zinc-900">{label}</div>
      <div
        className={`h-6 w-11 rounded-full transition-colors ${
          enabled ? "bg-green-500" : "bg-zinc-200"
        }`}
      ></div>
    </div>
  );
}

function TabHistoryModeRow() {
  const tabHistoryMode = useTabHistoryMode();

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-zinc-900">Bottom tab back behavior</div>
      <p className="text-xs text-zinc-500">
        Native mode keeps tab switches out of browser history. Web mode includes tab
        switches in history.
      </p>
      <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1">
        <ModeButton
          mode="native"
          currentMode={tabHistoryMode}
          label="Native"
          onSelect={setTabHistoryMode}
        />
        <ModeButton
          mode="web"
          currentMode={tabHistoryMode}
          label="Web"
          onSelect={setTabHistoryMode}
        />
      </div>
    </div>
  );
}

function ModeButton({
  mode,
  currentMode,
  label,
  onSelect,
}: {
  mode: TabHistoryMode;
  currentMode: TabHistoryMode;
  label: string;
  onSelect: (mode: TabHistoryMode) => void;
}) {
  const selected = currentMode === mode;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => {
        haptic(40);
        onSelect(mode);
      }}
      className={`touch-control rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        selected
          ? "bg-blue-600 text-white shadow-sm"
          : "bg-transparent text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {label}
    </button>
  );
}
