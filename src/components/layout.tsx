import { StarFilledIcon } from "@radix-ui/react-icons";
import {
  Link,
  LinkProps,
  useLocation,
  useMatchRoute,
} from "@tanstack/react-router";
import {
  ArrowLeftRightIcon,
  GiftIcon,
  HomeIcon,
  UserRoundIcon,
} from "lucide-react";

// Maybe allow iOS bridge to control back gestures via a useeffect on location change
const BOTTOM_NAV_PATHS = ["/", "/move-money", "/rewards", "/profile"] as const;

export function useIsBottomNavPath() {
  const location = useLocation();
  return BOTTOM_NAV_PATHS.includes(
    location.pathname as (typeof BOTTOM_NAV_PATHS)[number]
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-20">
      <main>{children}</main>
      <div className="fixed bottom-0 left-0 right-0 z-50 ">
        <nav className="flex justify-around bg-[#F5F5F5]/95 backdrop-blur-lg p-1 border-t border-gray-800 pb-[env(safe-area-inset-bottom)]">
          <MyNavLink to="/" icon={HomeIcon} label="Home" />
          <MyNavLink
            to="/move-money"
            icon={ArrowLeftRightIcon}
            label="Move Money"
          />
          <MyNavLink to="/rewards" icon={GiftIcon} label="Rewards" />
          <MyNavLink to="/profile" icon={UserRoundIcon} label="Profile" />
        </nav>
      </div>
    </div>
  );
}

interface MyNavLinkProps extends LinkProps {
  icon: any;
  label: string;
}
const MyNavLink = ({ to, icon: Icon, label }: MyNavLinkProps) => {
  const location = useLocation();
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to });
  const isBottomNavPath = useIsBottomNavPath();

  return (
    <Link
      to={to}
      preload="render"
      replace={isBottomNavPath}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
        select-none touch-none
        -webkit-touch-callout-none
        ${isActive ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <Icon aria-hidden size={24} />
      <span className="text-xs">{label}</span>
    </Link>
  );
};
export function RootLayout2({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-10 ">
      <div className="col-span-2 hidden md:block">
        <Nav />
      </div>
      <div className="col-span-6  overflow-auto bg-[#E5E5E6]">
        <main className="flex h-screen w-full flex-col">
          <div
            className="pt-16"
            style={{
              height: "calc(100vh - 4rem)",
            }}
          >
            {children}
          </div>
          <BottomNavBar />
        </main>
      </div>

      <div className="col-span-2 text-sm font-semibold">
        <div className="flex justify-between border-b-2 p-4">
          <button>Welcome, Bob</button>
          <button>Log Out</button>
        </div>
        <ul>
          <NavLink>Help</NavLink>
          <NavLink>Contact Us</NavLink>
          <NavLink>Locations</NavLink>
          <NavLink>Schedule an Appointment</NavLink>
        </ul>
      </div>
    </div>
  );
}

const Nav = () => {
  return (
    <nav className="flex w-full flex-col pt-2">
      <div className="self-center pb-4 pt-4">
        <img
          alt="logo"
          src="/logo_u_uwcu_stacked.svg"
          width={170}
          height={170}
        />
      </div>

      <AccountsNav />
      <ul className="text-sm font-semibold">
        <NavLink href={"/dashboard"}>Dashboard</NavLink>
        <NavLink href={"/transferspayments"}>Transfers & Payments</NavLink>
        <NavLink>Send Money</NavLink>
        <NavLink>Mobile Deposit</NavLink>
        <NavLink>Statements & Files</NavLink>
        <NavLink>Reports</NavLink>
        <NavLink>Services</NavLink>
        <NavLink>Products & Offers</NavLink>
      </ul>
    </nav>
  );
};

function NavLink({
  href = "#",
  children,
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="border-b transition-all hover:bg-gray-200">
      <Link className="flex p-4" to="/">
        {children}
      </Link>
    </li>
  );
}

function AccountsNav() {
  return (
    <div className="relative px-4">
      <div className="absolute left-0 right-0 ml-auto mr-auto flex px-2 py-3 opacity-5 ">
        <img alt="logo" src="/watermark_u.svg" width={260} height={260} />
      </div>
      <div>Accounts</div>
      <ul className="flex flex-col gap-4 p-4">
        <AccountNavItem />
        <AccountNavItem />
        <AccountNavItem />
        <div className="flex justify-between">
          <div>All Accounts</div>
          <div>Manage Cards</div>
        </div>
      </ul>
    </div>
  );
}

const AccountNavItem = ({ children }: { children?: React.ReactNode }) => {
  return (
    <li className="flex gap-2 border-t-2">
      <div className="self-center rounded-full bg-red-600 p-1 text-red-600">
        <StarFilledIcon className="text-white" height={16} width={16} />
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-medium ">Checking</div>
        <div className="flex text-xl font-semibold">
          <span className="px-1 text-base">$</span>13,032.24
        </div>
      </div>
    </li>
  );
};

const BottomNavBar = () => {
  return (
    <nav className="top bottom-0 left-0 right-0">
      <ul className="flex justify-around">
        <li>Home</li>
        <li>Accounts</li>
        <li>Transfers</li>
        <li>Payments</li>
        <li>More</li>
      </ul>
    </nav>
  );
};
