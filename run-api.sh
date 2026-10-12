#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  echo "Usage: ./run-api.sh [Playwright options, e.g. --grep 'cart']"
  echo "Default: all API tests"
  exit 0
fi

npx playwright test tests/api --project=api "$@"