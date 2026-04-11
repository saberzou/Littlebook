#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

COUNT=$(jq 'length' queue.json 2>/dev/null || echo "0")

echo "Current queue size: $COUNT"

if [ "$COUNT" -lt 10 ]; then
    echo "Queue is low (< 10). Needs refill."
    exit 2 # Special exit code signaling refill needed
fi

echo "Queue is healthy."
exit 0
