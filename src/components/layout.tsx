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

  return (
    <WrappedLink
      preload="viewport"
      to={to}
      replace={true}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 select-none touch-none ${
        isActive
          ? "text-blue-600 scale-105"
          : "text-gray-400 hover:text-gray-600"
      }`}
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <Icon aria-hidden size={24} />
      <span className="text-xs font-medium">{label}</span>
    </WrappedLink>
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const isBottomNavPath = useIsBottomNavPath();
  const showBackButton = canGoBack && !isBottomNavPath;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {showBackButton && (
        <Button
          onPress={() => router.history.back()}
          className="fixed top-4 left-4 z-10 rounded-full bg-white/90 backdrop-blur p-3 shadow-lg text-blue-700 hover:text-blue-800 transition-all hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeftIcon className="h-5 w-5" aria-hidden />
          <span className="sr-only">Back</span>
        </Button>
      )}
      <main className="pb-[calc(5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      {isBottomNavPath && (
        <nav className="fixed bottom-0 inset-x-0 z-10">
          <div className="bg-white/80 backdrop-blur-lg border-t border-gray-100 shadow-lg px-2 py-1">
            <div
              className="flex justify-around items-center max-w-md mx-auto"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              <MyNavLink to="/" icon={HomeIcon} label="Home" />
              <MyNavLink
                to="/move-money"
                icon={ArrowLeftRightIcon}
                label="Transfer"
              />
              <MyNavLink to="/rewards" icon={GiftIcon} label="Rewards" />
              <MyNavLink to="/profile" icon={UserRoundIcon} label="Profile" />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
