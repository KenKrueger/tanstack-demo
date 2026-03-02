let programmaticPopOverrideExpiresAt = 0;

const PROGRAMMATIC_POP_OVERRIDE_WINDOW_MS = 1200;

export function requestProgrammaticPopTransitionOverride() {
  programmaticPopOverrideExpiresAt =
    Date.now() + PROGRAMMATIC_POP_OVERRIDE_WINDOW_MS;
}

export function consumeProgrammaticPopTransitionOverride() {
  if (programmaticPopOverrideExpiresAt <= Date.now()) {
    programmaticPopOverrideExpiresAt = 0;
    return false;
  }

  programmaticPopOverrideExpiresAt = 0;
  return true;
}
