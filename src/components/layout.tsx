import {
  useRouter,
  useCanGoBack,
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
import { Button } from "react-aria-components";
import { WrappedLink } from "./wrapped-link";

const BOTTOM_NAV_PATHS = ["/", "/move-money", "/rewards", "/profile"] as const;

function useIsBottomNavPath() {
  const location = useLocation();
  return BOTTOM_NAV_PATHS.includes(
    location.pathname as (typeof BOTTOM_NAV_PATHS)[number]
  );
}

interface MyNavLinkProps {
  to: string;
  icon: (props: any) => React.ReactNode;
  label: string;
}

function MyNavLink({ to, icon: Icon, label }: MyNavLinkProps) {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to });
  const isBottomNavPath = useIsBottomNavPath();

  return (
    <WrappedLink
      to={to}
      preload="render"
      preloadDelay={500}
      replace={isBottomNavPath}
      className={`flex flex-col items-center gap-1 p-2 
        transition-colors select-none touch-none 
        text-gray-400 hover:text-gray-600 
        ${isActive ? "text-red-600 hover:text-red-600" : ""}`}
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <Icon aria-hidden size={24} />
      <span className="text-xs">{label}</span>
    </WrappedLink>
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const isBottomNavPath = useIsBottomNavPath();
  const showBackButton = canGoBack && !isBottomNavPath;

  return (
    <div className="min-h-screen">
      {showBackButton && (
        <Button
          onPress={() => router.history.back()}
          className="text-black p-2 focus:outline-none focus-visible:outline-none"
        >
          <ArrowLeftIcon className="h-7 w-7" aria-hidden />
          <span className="sr-only">Back</span>
        </Button>
      )}
      <main className="pb-[calc(4rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-[#F5F5F5]/95 backdrop-blur-lg p-1 border-t border-gray-300 pb-[env(safe-area-inset-bottom)]">
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
  );
}
