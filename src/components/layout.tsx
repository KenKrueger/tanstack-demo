import { StarFilledIcon } from "@radix-ui/react-icons";
import {
  useRouter,
  useCanGoBack,
  Link,
  LinkProps,
  useLocation,
  useMatchRoute,
} from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  ArrowLeftRightIcon,
  GiftIcon,
  HomeIcon,
  UserRoundIcon,
} from "lucide-react";
import { WrappedLink } from "./wrapped-link";
import { Button } from "./ui/Button";

// Maybe allow iOS bridge to control back gestures via a useeffect on location change
const BOTTOM_NAV_PATHS = ["/", "/move-money", "/rewards", "/profile"] as const;

export function useIsBottomNavPath() {
  const location = useLocation();
  return BOTTOM_NAV_PATHS.includes(
    location.pathname as (typeof BOTTOM_NAV_PATHS)[number]
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const isBottomNavPath = useIsBottomNavPath();
  const showBackButton = canGoBack && !isBottomNavPath;
  return (
    <div className="min-h-screen pb-20 bg-[#F5F5F5]/95">
      {showBackButton ? (
        <Button
          onPress={() => router.history.back()}
          className={"bg-transparent text-black"}
        >
          <ArrowLeftIcon className="h-6 w-6" aria-hidden />
          <span className="sr-only">Back</span>
        </Button>
      ) : null}
      <main>{children}</main>
      <div className="fixed bottom-0 left-0 right-0 z-50 ">
        <nav className="flex justify-around bg-[#F5F5F5]/95 backdrop-blur-lg px-1 pt-1  border-t border-gray-800 pb-[env(safe-area-inset-bottom)]">
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
    <WrappedLink
      to={to}
      preload="render"
      preloadDelay={500}
      replace={isBottomNavPath}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
        select-none touch-none
        -webkit-touch-callout-none
       text-gray-400 hover:text-gray-200"`}
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      activeProps={{ className: "text-red-600 hover:text-red-600" }}
    >
      <Icon aria-hidden size={24} />
      <span className="text-xs">{label}</span>
    </WrappedLink>
  );
};
