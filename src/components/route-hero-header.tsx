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
    <header className={`bg-gradient-to-r text-white ${gradientClassName}`}>
      <div className="mx-auto w-full max-w-4xl px-4 pb-5 pt-[calc(var(--effective-safe-area-top)+0.75rem)] sm:px-6">
        <div className="route-hero-glass rounded-2xl border border-white/35 px-4 py-4 shadow-[0_14px_28px_rgba(0,0,0,0.16)]">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-white/85">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
