export const MAIN_NAV_GRADIENT_BY_THEME = {
  home: "from-blue-600 to-indigo-700",
  moveMoney: "from-teal-700 to-cyan-800",
  rewards: "from-emerald-600 to-emerald-700",
  profile: "from-slate-600 to-slate-700",
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

