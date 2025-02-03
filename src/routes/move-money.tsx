import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/move-money")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TransfersPayments />;
}

function TransfersPayments() {
  return (
    <>
      <h1 className="p-4  self-center text-4xl font-semibold text-zinc-800">
        Move Money
      </h1>

      <div className="p-4">
        <MenuSection title="Your Accounts">
          <MenuItem
            href="transferspayments/transfer"
            title="Make a Transfer"
            subtitle="Move money between your accounts."
          ></MenuItem>

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
          ></MenuItem>

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

const MenuSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      {/* <h2 className="pb-2 text-sm font-medium  text-gray-600">{title}</h2> */}
      <ul className="mb-4 border-2 border-gray-200 bg-white"> {children}</ul>
    </>
  );
};

const MenuItem = ({
  title,
  subtitle,
  href,
}: {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  href: string;
}) => {
  return (
    <li className="flex flex-row justify-between border-b border-gray-300 p-4">
      <div>
        <Link to={href}>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </Link>
      </div>
      <div className="self-center text-2xl text-blue-400">
        <ChevronRight aria-hidden />
      </div>
    </li>
  );
};
