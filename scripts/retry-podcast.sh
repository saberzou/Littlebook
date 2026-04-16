#!/bin/bash
set -euo pipefail
REPO_DIR="/Users/saberzou/.openclaw/workspace/Littlebook"
ENV_FILE="/Users/saberzou/.openclaw/.env"
source "$ENV_FILE"

DATE="$1"  # e.g., 2026-04-16

# Check if audio already exists in data.js
if node -e "const s=require('fs').readFileSync('$REPO_DIR/data.js','utf8'); const i=s.indexOf('date: \"$DATE\"'); if(i<0){process.exit(1)} if(s.slice(i,i+800).includes('audio:')){console.log('exists');process.exit(0)} process.exit(1)" 2>/dev/null; then
  echo "Audio already exists for $DATE"
  exit 0
fi

# Run the main script (it handles the date via TOMORROW variable)
# Override TOMORROW by setting date to match
export FORCE_DATE="$DATE"
bash "$REPO_DIR/scripts/generate-podcast.sh"
