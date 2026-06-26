#!/usr/bin/env bash
# Prints [CAPYBARAA] when on. Empty when off/unset. Legacy values (deep/lean) count as on.
flag="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/.capybaraa-active"
[ -f "$flag" ] || exit 0
state=$(head -n1 "$flag" | tr -d '[:space:]')
[ -z "$state" ] && exit 0
[ "$state" = "off" ] && exit 0
printf '\033[38;5;179m[CAPYBARAA]\033[0m'
