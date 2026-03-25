#!/bin/bash
# Generate NotebookLM podcast for the next day's book in Littlebook
# Run after daily content cron adds a new book to data.js
set -euo pipefail

REPO_DIR="/Users/saberzou/.openclaw/workspace/Littlebook"
ENV_FILE="/Users/saberzou/.openclaw/.env"
source "$ENV_FILE"

_t() { date +%s; }
_log() { echo "[$(date '+%H:%M:%S')] $*"; }

# Get tomorrow's date (the book that was just added by daily content cron)
TOMORROW=$(date -v+1d +%Y-%m-%d 2>/dev/null || date -d '+1 day' +%Y-%m-%d)

# Extract ALL book info in a single node call (avoid 4x overhead)
_T=$(_t)
PARSED=$(node -e "
  const fs = require('fs');
  const src = fs.readFileSync('$REPO_DIR/data.js', 'utf8');
  const dateIdx = src.indexOf('date: \"$TOMORROW\"');
  if (dateIdx < 0) { console.error('No entry for $TOMORROW'); process.exit(1); }
  const chunk = src.slice(dateIdx, dateIdx + 800);
  const g = (k) => { const m = chunk.match(new RegExp(k + ': \"([^\"]+)\"')); return m ? m[1] : ''; };
  // Check audio already exists
  if (chunk.includes('audio:')) { console.log('__AUDIO_EXISTS__'); process.exit(0); }
  const title = g('title'); const author = g('author'); const cat = g('category');
  // Print as tab-separated for IFS splitting
  process.stdout.write(title + '\t' + author + '\t' + cat + '\n');
")
if [[ $? -ne 0 ]] || [[ -z "$PARSED" ]]; then
  echo "❌ No book entry found for $TOMORROW in data.js" >&2
  exit 1
fi
IFS=$'\t' read -r TITLE AUTHOR CATEGORY <<< "$PARSED"
_log "parse data.js: $(( $(_t) - _T ))s"

if [[ "$TITLE" == "__AUDIO_EXISTS__" ]]; then
  echo "⏭️ Audio already exists for $TOMORROW, skipping"
  exit 0
fi

# Also grab DESC (multi-word, needs separate extraction)
DESC=$(node -e "
  const fs = require('fs');
  const src = fs.readFileSync('$REPO_DIR/data.js', 'utf8');
  const dateIdx = src.indexOf('date: \"$TOMORROW\"');
  const chunk = src.slice(dateIdx, dateIdx + 800);
  const m = chunk.match(/desc: \"([^\"]+)\"/);
  console.log(m ? m[1] : '');
")

echo "📚 Generating podcast for: $TITLE by $AUTHOR ($TOMORROW)"

# Create NotebookLM notebook
_T=$(_t)
NB_ID=$(notebooklm create "$TITLE - $AUTHOR" --json 2>/dev/null | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).notebook.id")
_log "notebooklm create: $(( $(_t) - _T ))s | NB_ID=$NB_ID"
echo "📓 Created notebook: $NB_ID"
notebooklm use "$NB_ID" >/dev/null 2>&1

# Create source document
SOURCE_FILE=$(mktemp /tmp/littlebook-source-XXXXXX).md
cat > "$SOURCE_FILE" << SRCEOF
# $TITLE by $AUTHOR

## Category: $CATEGORY

## Overview
$DESC

## Why This Book Matters
This is the kind of book that changes how you see the world. It belongs in the category of $CATEGORY, and readers consistently find it thought-provoking and transformative.

## Key Themes to Discuss
- What makes this book unique in its genre
- The core argument or narrative
- Who should read this and why
- What readers take away from it
SRCEOF

_T=$(_t)
notebooklm source add "$SOURCE_FILE" >/dev/null 2>&1
rm "$SOURCE_FILE"
_log "notebooklm source add: $(( $(_t) - _T ))s"

# Generate audio (brief, short)
echo "🎙️ Generating audio..."
_T=$(_t)
AUDIO_OUTPUT=$(notebooklm generate audio --format brief --length short --wait --retry 3 \
  "A concise 2-3 minute podcast overview of $TITLE by $AUTHOR. Be engaging and conversational." 2>&1) || true
_log "notebooklm generate audio --wait: $(( $(_t) - _T ))s  ← main bottleneck"
echo "$AUDIO_OUTPUT"

# If generate failed, try downloading anyway (artifact may exist from a previous attempt)
if echo "$AUDIO_OUTPUT" | grep -qi "fail\|error"; then
  echo "⚠️ Generate reported error, but checking if audio artifact exists anyway..."
fi

# Download audio
_T=$(_t)
TMP_AUDIO=$(mktemp /tmp/littlebook-audio-XXXXXX).mp3
notebooklm download audio --latest "$TMP_AUDIO" >/dev/null 2>&1
_log "download audio: $(( $(_t) - _T ))s | raw size: $(du -h "$TMP_AUDIO" | cut -f1)"

# Compress to 64kbps mono
_T=$(_t)
COMPRESSED=$(mktemp /tmp/littlebook-compressed-XXXXXX).mp3
ffmpeg -y -i "$TMP_AUDIO" -b:a 64k -ac 1 "$COMPRESSED" >/dev/null 2>&1
rm "$TMP_AUDIO"
_log "ffmpeg compress: $(( $(_t) - _T ))s | compressed: $(du -h "$COMPRESSED" | cut -f1)"
echo "🔊 Compressed audio: $(du -h "$COMPRESSED" | cut -f1)"

# Upload to Vercel Blob — filter output to only grab the https URL (avoid upgrade notices polluting the var)
_T=$(_t)
BLOB_URL=$(vercel blob put "$COMPRESSED" \
  --pathname "littlebook/audio/$TOMORROW.mp3" \
  --allow-overwrite true --add-random-suffix false \
  --rw-token "$BLOB_READ_WRITE_TOKEN" --token "$VERCEL_TOKEN" 2>&1 \
  | grep -o 'https://[^[:space:]]*\.mp3')
rm "$COMPRESSED"
_log "vercel blob put: $(( $(_t) - _T ))s | URL: $BLOB_URL"
echo "☁️ Uploaded: $BLOB_URL"

# Validate URL was captured
if [[ -z "$BLOB_URL" ]]; then
  echo "❌ BLOB_URL is empty — vercel output may have changed. Check manually." >&2
  exit 1
fi

# Update data.js — add audio field after the date line (pure node, no shell variable interpolation in -e)
cd "$REPO_DIR"
node << JSEOF
const fs = require('fs');
let s = fs.readFileSync('data.js', 'utf8');
const marker = 'date: "$TOMORROW",';
const idx = s.indexOf(marker);
if (idx < 0) { console.error('Date marker not found'); process.exit(1); }
const insertAt = idx + marker.length;
s = s.slice(0, insertAt) + '\n        audio: "$BLOB_URL",' + s.slice(insertAt);
fs.writeFileSync('data.js', s);
console.log('data.js updated');
JSEOF

# Validate JS before committing
bash "$REPO_DIR/scripts/validate-js.sh" data.js

# Commit and push
git add -A
git commit -m "feat: add AI podcast for $TITLE ($TOMORROW)"
git push

# Clean up NotebookLM notebook
notebooklm delete -n "$NB_ID" --yes >/dev/null 2>&1 || true

echo "✅ Done! Podcast for $TITLE ($TOMORROW) is live."
