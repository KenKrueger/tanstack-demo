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
import { useTabHistoryMode } from "../lib/tab-history-mode";
import { haptic } from "../lib/haptic";

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
  replace: boolean;
}

function MyNavLink({ to, icon: Icon, label, replace }: MyNavLinkProps) {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to });

  return (
    <WrappedLink
      preload="viewport"
      to={to}
      replace={replace}
      onPressStart={() => haptic(15)}
      aria-current={isActive ? "page" : undefined}
      className={`touch-control flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 rounded-xl p-2 transition-all duration-200 ${
        isActive
          ? "text-blue-600 scale-105"
          : "text-gray-400 hover:text-gray-600"
      }`}
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
  const tabHistoryMode = useTabHistoryMode();
  const replaceTabHistory = tabHistoryMode === "native";
  const mainPaddingBottom = isBottomNavPath
    ? "calc(var(--bottom-nav-height) + var(--effective-safe-area-bottom))"
    : undefined;

  return (
    <div className="min-h-screen min-h-[100svh] bg-gradient-to-br from-slate-50 to-blue-50">
      {showBackButton && (
        <Button
          onPress={() => router.history.back()}
          onPressStart={() => haptic(15)}
          className="fixed top-4 left-4 z-10 rounded-full bg-white/90 backdrop-blur p-3 shadow-lg text-blue-700 hover:text-blue-800 transition-all hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeftIcon className="h-5 w-5" aria-hidden />
          <span className="sr-only">Back</span>
        </Button>
      )}
      <main style={{ paddingBottom: mainPaddingBottom }}>
        {children}
      </main>

      {isBottomNavPath && (
        <nav aria-label="Primary" className="fixed bottom-0 inset-x-0 z-10">
          <div className="border-t border-gray-100 bg-white/80 px-2 pb-[var(--effective-safe-area-bottom)] shadow-lg backdrop-blur-lg">
            <div className="mx-auto flex min-h-[var(--bottom-nav-height)] max-w-md items-center">
              <MyNavLink to="/" icon={HomeIcon} label="Home" replace={replaceTabHistory} />
              <MyNavLink
                to="/move-money"
                icon={ArrowLeftRightIcon}
                label="Transfer"
                replace={replaceTabHistory}
              />
              <MyNavLink to="/rewards" icon={GiftIcon} label="Rewards" replace={replaceTabHistory} />
              <MyNavLink to="/profile" icon={UserRoundIcon} label="Profile" replace={replaceTabHistory} />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
