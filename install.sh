#!/usr/bin/env bash
set -euo pipefail

npm ci

if [[ "$(uname -s)" == "Linux" ]]; then
	npx playwright install --with-deps
else
	npx playwright install
fi
