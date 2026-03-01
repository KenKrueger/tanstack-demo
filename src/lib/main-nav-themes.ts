export const MAIN_NAV_GRADIENT_BY_THEME = {
  home: "from-stone-900 via-stone-800 to-emerald-950",
  moveMoney: "from-teal-950 to-cyan-950",
  rewards: "from-amber-950 via-amber-900 to-yellow-950",
  profile: "from-stone-900 to-stone-950",
} as const;

export type MainNavThemeName = keyof typeof MAIN_NAV_GRADIENT_BY_THEME;

export const MAIN_NAV_THEMES = {
  "/": {
    theme: "home",
    gradientClassName: MAIN_NAV_GRADIENT_BY_THEME.home,
  },
  "/move-money": {
    theme: "moveMoney",
    gradientClassName: MAIN_NAV_GRADIENT_BY_THEME.moveMoney,
  },
  "/rewards": {
    theme: "rewards",
    gradientClassName: MAIN_NAV_GRADIENT_BY_THEME.rewards,
  },
  "/profile": {
    theme: "profile",
    gradientClassName: MAIN_NAV_GRADIENT_BY_THEME.profile,
  },
} as const;

export type MainNavPathname = keyof typeof MAIN_NAV_THEMES;

const MAIN_NAV_PATHS = Object.keys(MAIN_NAV_THEMES) as MainNavPathname[];

export function getMainNavPathname(pathname: string): MainNavPathname | null {
  for (const path of MAIN_NAV_PATHS) {
    if (path === "/") {
      if (pathname === "/") {
        return path;
      }
      continue;
    }

    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return path;
    }
  }

  return null;
}

