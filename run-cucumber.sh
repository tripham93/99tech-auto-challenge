#!/usr/bin/env bash
set -euo pipefail

browser="chromium"
headless="true"
args=()
has_args=false

while (($#)); do
  case "$1" in
    --browser)
      shift
      case "${1:-}" in
        chrome|chromium) browser="chromium" ;;
        firefox) browser="firefox" ;;
        safari|webkit) browser="webkit" ;;
        *) echo "Use --browser chrome|firefox|safari" >&2; exit 2 ;;
      esac
      ;;
    --headed) headless="false" ;;
    --headless) headless="true" ;;
    -h|--help)
      echo "Usage: ./run-cucumber.sh [--browser chrome|firefox|safari] [--headed|--headless] [Cucumber options]"
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

if [[ "$has_args" == true ]]; then
  BROWSER="$browser" HEADLESS="$headless" npx cucumber-js "${args[@]}"
else
  BROWSER="$browser" HEADLESS="$headless" npx cucumber-js
fi