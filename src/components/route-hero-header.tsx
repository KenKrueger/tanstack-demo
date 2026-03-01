import {
  MAIN_NAV_GRADIENT_BY_THEME,
  type MainNavThemeName,
} from "../lib/main-nav-themes";

interface RouteHeroHeaderProps {
  title: string;
  subtitle?: string;
  theme: MainNavThemeName;
}

export function RouteHeroHeader({
  title,
  subtitle,
  theme,
}: RouteHeroHeaderProps) {
  const gradientClassName = MAIN_NAV_GRADIENT_BY_THEME[theme];

  return (
    <header
      className={`relative isolate overflow-hidden bg-gradient-to-r text-white ${gradientClassName}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-white/0 to-black/10"
      />
      <div className="mx-auto w-full max-w-4xl px-4 pb-6 pt-[calc(var(--effective-safe-area-top)+0.75rem)] sm:px-6">
        <div className="route-hero-glass max-w-xl rounded-[1.25rem] border border-white/30 px-4 py-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-white/85">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
