import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "../components/card";
import { PageHeader } from "../components/page-header";
import { profileQueryOptions } from "../lib/api/fake-api";
import { useSuspenseQuery } from "@tanstack/react-query";

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
