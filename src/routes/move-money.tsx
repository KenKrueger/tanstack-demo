import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { RouteHeroHeader } from "../components/route-hero-header";

export const Route = createFileRoute("/move-money")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Move Money" }] }),
});

function RouteComponent() {
  return (
    <>
      <RouteHeroHeader
        title="Move Money"
        subtitle="Transfer and payment tools"
        theme="moveMoney"
      />
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <TransfersPayments />
        <div className="max-w-2xl">
          <Outlet />
        </div>
      </div>
    </>
  );
}

function TransfersPayments() {
  return (
    <>
      <MenuSection title="Your Accounts">
        <MenuItem
          to="/move-money/transfer"
          title="Make a Transfer"
          subtitle="Move money between your accounts."
        />
        <MenuItem
          title="Make a Payment"
          subtitle="Pay your Loans."
        />
        <MenuItem
          title="Zelle®"
          subtitle="Send money to friends and family."
        />
        <MenuItem
          title="Bill Pay"
          subtitle="Pay bills online or send a check."
        />
        <MenuItem
          title="Banana Link"
          subtitle="Send money to Members."
        />
        <MenuItem
          title="Wire Transfer"
          subtitle="Send money almost anywhere."
        />
      </MenuSection>
    </>
  );
}

function MenuSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="pb-2 text-sm font-medium text-gray-600">{title}</h2>
      <ul className="mb-4 border border-gray-200 bg-white rounded">
        {children}
      </ul>
    </div>
  );
}

function MenuItem({
  title,
  subtitle,
  to,
}: {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  to?: string;
}) {
  return (
    <li className="flex flex-row justify-between items-center border-b border-gray-200 p-4">
      {to ? (
        <>
          <Link to={to as any} resetScroll={false} className="no-underline text-inherit flex-1">
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-gray-500">{subtitle}</div>
          </Link>
          <ChevronRight aria-hidden className="text-blue-400" />
        </>
      ) : (
        <>
          <div className="text-inherit flex-1">
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-gray-500">{subtitle}</div>
          </div>
          <ChevronRight aria-hidden className="text-gray-300" />
        </>
      )}
    </li>
  );
}
