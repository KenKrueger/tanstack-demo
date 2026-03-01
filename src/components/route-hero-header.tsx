import { type MainNavThemeName } from "../lib/main-nav-themes";

interface RouteHeroHeaderProps {
  title: string;
  subtitle?: string;
  theme: MainNavThemeName;
  renderTitle?: (title: string) => React.ReactNode;
}

export function RouteHeroHeader({
  title,
  subtitle,
  theme,
  renderTitle,
}: RouteHeroHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-4xl px-4 pt-[calc(var(--effective-safe-area-top)+1.25rem)] pb-2 sm:px-6">
      {renderTitle ? (
        <h1>{renderTitle(title)}</h1>
      ) : (
        <h1 className="text-[1.75rem] font-bold tracking-tight text-stone-900 font-display leading-tight">
          {title}
        </h1>
      )}
      {subtitle ? (
        <p className="mt-1 text-sm text-stone-400">{subtitle}</p>
      ) : null}
    </header>
  );
}
