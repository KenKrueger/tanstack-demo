let pendingAccountCardTransitionId: string | null = null;

export function markPendingAccountCardTransition(accountId: string) {
  pendingAccountCardTransitionId = accountId;
}

export function consumePendingAccountCardTransition(accountId: string) {
  if (pendingAccountCardTransitionId !== accountId) return false;
  pendingAccountCardTransitionId = null;
  return true;
}
