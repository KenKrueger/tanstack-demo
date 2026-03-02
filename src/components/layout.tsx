import {
  useRouter,
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
import { getMainNavPathname } from "../lib/main-nav-themes";
import { requestProgrammaticPopTransitionOverride } from "../lib/view-transition-overrides";
import { useRef } from "react";

interface MyNavLinkProps {
  to: string;
  icon: (props: any) => React.ReactNode;
  label: string;
  replace: boolean;
}

function MyNavLink({ to, icon: Icon, label, replace }: MyNavLinkProps) {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to });
  const lastHomeTapMs = useRef(0);

  const handlePress = () => {
    if (to !== "/" || !isActive) return;

    const now = Date.now();
    if (now - lastHomeTapMs.current <= 350) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      haptic(20);
      lastHomeTapMs.current = 0;
      return;
    }

    lastHomeTapMs.current = now;
  };

  return (
    <WrappedLink
      preload="viewport"
      to={to}
      replace={replace}
      viewTransition={false}
      onPress={handlePress}
      onPressStart={() => haptic(40)}
      onContextMenu={(event) => event.preventDefault()}
      aria-current={isActive ? "page" : undefined}
      className={`touch-control [-webkit-user-drag:none] flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 rounded-xl p-2 transition-all duration-200 ${
        isActive
          ? "text-stone-900 scale-105"
          : "text-stone-400 hover:text-stone-600"
      }`}
    >
      <Icon aria-hidden size={22} />
      <span className="text-[11px] font-medium leading-none">{label}</span>
      {isActive && (
        <div className="w-1 h-1 rounded-full bg-stone-800 mt-0.5" />
      )}
    </WrappedLink>
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const location = useLocation();
  const locationHistoryIndex =
    typeof location.state === "object" &&
    location.state !== null &&
    typeof (location.state as { __TSR_index?: unknown }).__TSR_index === "number"
      ? (location.state as { __TSR_index: number }).__TSR_index
      : 0;
  const canGoBack = locationHistoryIndex > 0;
  const isBottomNavPath = getMainNavPathname(location.pathname) !== null;
  const isAccountDetailsPath = location.pathname.startsWith("/accounts/index/");
  const showBackButton = canGoBack && !isBottomNavPath;
  const tabHistoryMode = useTabHistoryMode();
  const replaceTabHistory = tabHistoryMode === "native";
  const mainPaddingBottom = isBottomNavPath
    ? "calc(var(--bottom-nav-height) + var(--effective-safe-area-bottom))"
    : undefined;

  const handleBackPress = () => {
    if (isAccountDetailsPath) {
      requestProgrammaticPopTransitionOverride();
    }
    router.history.back();
  };

  return (
    <div className="min-h-screen min-h-[100svh] bg-[#FAF7F2]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[5] h-[var(--effective-safe-area-top)] bg-[#FAF7F2]"
      />
      {showBackButton && (
        <Button
          onPress={handleBackPress}
          onPressStart={() => haptic(40)}
          className="fixed left-4 top-[calc(var(--effective-safe-area-top)+1rem)] z-10 rounded-full bg-white/90 backdrop-blur p-3 shadow-lg text-stone-700 hover:text-stone-900 transition-all hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <ArrowLeftIcon className="h-5 w-5" aria-hidden />
          <span className="sr-only">Back</span>
        </Button>
      )}
      <main className="vtMain" style={{ paddingBottom: mainPaddingBottom }}>
        {children}
      </main>

      {isBottomNavPath && (
        <nav
          aria-label="Primary"
          className="vtTabbar fixed bottom-0 inset-x-0 z-10"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-[calc(var(--bottom-nav-height)+var(--effective-safe-area-bottom))] bg-white"
          />
          <div className="border-t border-stone-200/60 bg-white/85 px-2 pb-[var(--effective-safe-area-bottom)] shadow-lg backdrop-blur-xl">
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
