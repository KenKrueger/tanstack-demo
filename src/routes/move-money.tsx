import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { Drawer } from "@base-ui/react/drawer";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { RouteHeroHeader } from "../components/route-hero-header";

export const Route = createFileRoute("/move-money")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Move Money" }] }),
});

function RouteComponent() {
  const matchRoute = useMatchRoute();
  const isExactMatch = matchRoute({ to: "/move-money" });

  if (!isExactMatch) {
    // Child route is active — give it the full page
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Outlet />
      </div>
    );
  }

  return (
    <>
      <RouteHeroHeader
        title="Move Money"
        subtitle="Transfer and payment tools"
        theme="moveMoney"
      />
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <TransfersPayments />
      </div>
    </>
  );
}

function TransfersPayments() {
  const [open, setOpen] = useState(false);

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
        <li className="flex flex-row justify-between items-center border-b border-stone-100 p-4 last:border-b-0">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            className="text-inherit flex-1 text-left cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="font-semibold text-stone-800">Wire Transfer</div>
            <div className="text-sm text-stone-500">Send money almost anywhere.</div>
          </button>
          <ChevronRight aria-hidden className="text-stone-400" />
        </li>
      </MenuSection>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Backdrop className="fixed inset-0 bg-black/40" />
          <Drawer.Viewport className="fixed inset-x-0 bottom-0 flex justify-center">
            <Drawer.Popup
              className="w-full max-w-2xl rounded-t-2xl bg-white px-6 pt-6 shadow-xl"
              style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-stone-300" />
              <Drawer.Title className="text-lg font-semibold text-stone-800">
                Wire Transfer
              </Drawer.Title>
              <Drawer.Description className="mt-2 text-sm text-stone-500">
                Send money almost anywhere in the world. Wire transfers are
                processed same business day when initiated before 4 PM ET.
              </Drawer.Description>
              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-stone-800 py-3 text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
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
      <h2 className="pb-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">{title}</h2>
      <ul className="mb-4 border border-stone-200/60 bg-white rounded-2xl card-shadow overflow-hidden">
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
    <li className="flex flex-row justify-between items-center border-b border-stone-100 p-4 last:border-b-0">
      {to ? (
        <>
          <Link to={to as any} resetScroll={false} className="no-underline text-inherit flex-1">
            <div className="font-semibold text-stone-800">{title}</div>
            <div className="text-sm text-stone-500">{subtitle}</div>
          </Link>
          <ChevronRight aria-hidden className="text-stone-400" />
        </>
      ) : (
        <>
          <div className="text-inherit flex-1">
            <div className="font-semibold text-stone-800">{title}</div>
            <div className="text-sm text-stone-500">{subtitle}</div>
          </div>
          <ChevronRight aria-hidden className="text-stone-300" />
        </>
      )}
    </li>
  );
}
