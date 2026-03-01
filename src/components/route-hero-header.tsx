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
      <div className="mx-auto w-full max-w-4xl px-4 pb-5 pt-[calc(var(--effective-safe-area-top)+1rem)] sm:px-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-white/80">{subtitle}</p>
        ) : null}
      </div>
    </header>
  );
}

