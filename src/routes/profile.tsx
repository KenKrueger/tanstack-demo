import * as React from "react";
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
});

function ProfilePageWrapper() {
  return (
    <div>
      <PageHeader title="Profile" />
      <React.Suspense fallback={<div>Loading...</div>}>
        <ProfilePage />
      </React.Suspense>
    </div>
  );

  function ProfilePage() {
    const { data: mockProfile } = useSuspenseQuery(profileQueryOptions);
    return (
      <>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-semibold">
                {mockProfile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  {mockProfile.name}
                </h2>
                <p className="text-sm text-zinc-500">Member since 2022</p>
              </div>
            </div>
          </Card>

          <Card className="divide-y">
            <Section title="Personal Information">
              <InfoRow label="Email" value={mockProfile.email} />
              <InfoRow label="Phone" value={mockProfile.phone} />
              <InfoRow label="Address" value={mockProfile.address} />
            </Section>

            <Section title="Security">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-zinc-500">Enabled via SMS</div>
                </div>
                <div className="h-6 w-11 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-zinc-500 mt-4">
                Last login:{" "}
                {new Date(mockProfile.lastLogin).toLocaleDateString()}
              </div>
            </Section>

            <Section title="Notification Preferences">
              <ToggleRow
                label="Email Notifications"
                enabled={mockProfile.notifications.email}
              />
              <ToggleRow
                label="Push Notifications"
                enabled={mockProfile.notifications.push}
              />
              <ToggleRow
                label="SMS Notifications"
                enabled={mockProfile.notifications.sms}
              />
            </Section>
          </Card>
        </div>
      </>
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
}
