#!/bin/bash
# Generate NotebookLM podcast for the next day's book in Littlebook
# Run after daily content cron adds a new book to data.js
set -euo pipefail

REPO_DIR="/Users/saberzou/.openclaw/workspace/Littlebook"
ENV_FILE="/Users/saberzou/.openclaw/.env"
source "$ENV_FILE"

# Get tomorrow's date (the book that was just added by daily content cron)
TOMORROW=$(date -v+1d +%Y-%m-%d 2>/dev/null || date -d '+1 day' +%Y-%m-%d)

# Extract book info from data.js using node
BOOK_INFO=$(node -e "
  const fs = require('fs');
  const src = fs.readFileSync('$REPO_DIR/data.js', 'utf8');
  const dateIdx = src.indexOf('date: \"$TOMORROW\"');
  if (dateIdx < 0) { console.error('No entry for $TOMORROW'); process.exit(1); }
  const chunk = src.slice(dateIdx, dateIdx + 600);
  const g = (k) => { const m = chunk.match(new RegExp(k + ': \"([^\"]+)\"')); return m ? m[1] : ''; };
  console.log(JSON.stringify({ title: g('title'), author: g('author'), category: g('category'), desc: g('desc') }));
")

TITLE=$(echo "$BOOK_INFO" | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).title")
AUTHOR=$(echo "$BOOK_INFO" | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).author")
DESC=$(echo "$BOOK_INFO" | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).desc")
CATEGORY=$(echo "$BOOK_INFO" | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).category")

echo "📚 Generating podcast for: $TITLE by $AUTHOR ($TOMORROW)"

# Check if audio already exists in data.js for this date
if node -e "
  const s = require('fs').readFileSync('$REPO_DIR/data.js', 'utf8');
  const i = s.indexOf('date: \"$TOMORROW\"');
  if (i < 0) process.exit(1);
  const chunk = s.slice(i, i + 300);
  process.exit(chunk.includes('audio:') ? 0 : 1);
" 2>/dev/null; then
  echo "⏭️ Audio already exists for $TOMORROW, skipping"
  exit 0
fi

# Create NotebookLM notebook
NB_ID=$(notebooklm create "$TITLE - $AUTHOR" --json 2>/dev/null | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).notebook.id")
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

notebooklm source add "$SOURCE_FILE" >/dev/null 2>&1
rm "$SOURCE_FILE"

# Generate audio (brief, short)
echo "🎙️ Generating audio..."
notebooklm generate audio --format brief --length short --wait --timeout 600 --retry 3 \
  "A concise 2-3 minute podcast overview of $TITLE by $AUTHOR. Be engaging and conversational." 2>/dev/null

# Download audio
TMP_AUDIO=$(mktemp /tmp/littlebook-audio-XXXXXX).mp3
notebooklm download audio --latest "$TMP_AUDIO" >/dev/null 2>&1

# Compress to 64kbps mono
COMPRESSED=$(mktemp /tmp/littlebook-compressed-XXXXXX).mp3
ffmpeg -y -i "$TMP_AUDIO" -b:a 64k -ac 1 "$COMPRESSED" >/dev/null 2>&1
rm "$TMP_AUDIO"

SIZE=$(du -h "$COMPRESSED" | cut -f1)
echo "🔊 Compressed audio: $SIZE"

# Upload to Vercel Blob
BLOB_URL=$(vercel blob put "$COMPRESSED" \
  --pathname "littlebook/audio/$TOMORROW.mp3" \
  --allow-overwrite true --add-random-suffix false \
  --rw-token "$BLOB_READ_WRITE_TOKEN" --token "$VERCEL_TOKEN" 2>&1 | grep -o 'https://[^ ]*')
rm "$COMPRESSED"
echo "☁️ Uploaded: $BLOB_URL"

# Update data.js — add audio field after the date line
cd "$REPO_DIR"
node -e "
  let s = require('fs').readFileSync('data.js', 'utf8');
  const marker = 'date: \"$TOMORROW\",';
  const idx = s.indexOf(marker);
  if (idx < 0) { console.error('Date marker not found'); process.exit(1); }
  const insertAt = idx + marker.length;
  s = s.slice(0, insertAt) + '\n        audio: \"$BLOB_URL\",' + s.slice(insertAt);
  require('fs').writeFileSync('data.js', s);
"

# Commit and push
git add -A
git commit -m "feat: add AI podcast for $TITLE ($TOMORROW)"
git push

# Clean up NotebookLM notebook
notebooklm delete -n "$NB_ID" --yes >/dev/null 2>&1 || true

echo "✅ Done! Podcast for $TITLE ($TOMORROW) is live."
