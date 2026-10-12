#!/usr/bin/env bash
set -euo pipefail
source .env

mkdir -p performance/reports

k6 run \
    -e "PERFORMANCE_TARGET=$PERFORMANCE_TARGET" \
    -e "DEMOBLAZE_USERNAME=$DEMOBLAZE_USERNAME" \
    -e "DEMOBLAZE_PASSWORD=$DEMOBLAZE_PASSWORD" \
    performance/login-smoke.js