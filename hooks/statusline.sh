#!/usr/bin/env bash
# Prints a level badge, e.g. [CAPYBARA] or [CAPYBARA:HIGH]. Empty when off/unset.
flag="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/.capybara-active"
[ -f "$flag" ] || exit 0
level=$(head -n1 "$flag" | tr -d '[:space:]')
[ -z "$level" ] && exit 0
[ "$level" = "off" ] && exit 0
if [ "$level" = "medium" ]; then
  printf '\033[38;5;179m[CAPYBARA]\033[0m'
else
  printf '\033[38;5;179m[CAPYBARA:%s]\033[0m' "$(printf '%s' "$level" | tr '[:lower:]' '[:upper:]')"
fi
