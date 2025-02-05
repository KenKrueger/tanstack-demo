import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "../components/page-header";

export const Route = createFileRoute("/move-money")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Move Money" }] }),
});

function RouteComponent() {
  return <TransfersPayments />;
}

function TransfersPayments() {
  return (
    <>
      <PageHeader title="Move Money" />
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <MenuSection title="Your Accounts">
          <MenuItem
            href="transferspayments/transfer"
            title="Make a Transfer"
            subtitle="Move money between your accounts."
          />
          <MenuItem
            href="#"
            title="Make a Payment"
            subtitle="Pay your Loans."
          />
          <MenuItem
            href="#"
            title="Zelle®"
            subtitle="Send money to friends and family."
          />
          <MenuItem
            href="#"
            title="Bill Pay"
            subtitle="Pay bills online or send a check."
          />
          <MenuItem
            href="#"
            title="Banana Link"
            subtitle="Send money to Members."
          />
          <MenuItem
            href="#"
            title="Wire Transfer"
            subtitle="Send money almost anywhere."
          />
        </MenuSection>
      </div>
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
  href,
}: {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  href: string;
}) {
  return (
    <li className="flex flex-row justify-between items-center border-b border-gray-200 p-4">
      <a href={href} className="no-underline text-inherit">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </a>
      <ChevronRight aria-hidden className="text-blue-400" />
    </li>
  );
}
