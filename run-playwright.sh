#!/usr/bin/env bash
set -euo pipefail

projects=(chromium)
headed=""
args=()
has_args=false

while (($#)); do
  case "$1" in
    --browser)
      shift
      case "${1:-}" in
        chrome|chromium) projects=(chromium) ;;
        firefox) projects=(firefox) ;;
        safari|webkit) projects=(webkit) ;;
        all) projects=(chromium firefox webkit) ;;
        *) echo "Use --browser chrome|firefox|safari|all" >&2; exit 2 ;;
      esac
      ;;
    --headed) headed="--headed" ;;
    --headless) headed="" ;;
    -h|--help)
      echo "Usage: ./run-playwright.sh [--browser chrome|firefox|safari|all] [--headed|--headless] [Playwright options]"
      echo "Default: Chromium, headless"
      exit 0
      ;;
    --)
      shift
      if (($#)); then
        args+=("$@")
        has_args=true
      fi
      break
      ;;
    *) args+=("$1"); has_args=true ;;
  esac
  shift
done

command=(npx playwright test)
command+=(--project "${projects[@]}")
[[ -n "$headed" ]] && command+=("$headed")
if [[ "$has_args" == true ]]; then
  command+=("${args[@]}")
fi
"${command[@]}"