#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Not a bash command — allow
if [ -z "$COMMAND" ]; then
  exit 0
fi

# Block npm usage — this project uses pnpm
if echo "$COMMAND" | grep -qE "(^|&&|\|\||;)\s*npm "; then
  echo "Blocked: use pnpm instead of npm" >&2
  exit 2
fi

# Block git push — pushes must be done manually
if echo "$COMMAND" | grep -qE "(^|&&|\|\||;)\s*git push"; then
  echo "Blocked: git push is not allowed from agents. Push manually." >&2
  exit 2
fi

exit 0
