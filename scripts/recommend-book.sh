#!/usr/bin/env bash
# recommend-book.sh — Fetch a random book from Open Library, avoid duplicates with data.js
# Output: JSON {"title":"...","author":"...","isbn":"...","category":"...","desc":"..."}
# Usage: ./recommend-book.sh [/path/to/data.js]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_JS="${1:-$SCRIPT_DIR/../data.js}"

if [ ! -f "$DATA_JS" ]; then
  echo "ERROR: data.js not found at $DATA_JS" >&2
  exit 1
fi

# --- Extract all existing titles from data.js (lowercase, for fuzzy dedup) ---
EXISTING_TITLES=$(node -e "
  const fs = require('fs');
  const src = fs.readFileSync('$DATA_JS', 'utf8');
  const matches = [...src.matchAll(/title: \"([^\"]+)\"/g)];
  const titles = matches.map(m => m[1].toLowerCase().trim());
  console.log(JSON.stringify(titles));
")

# --- Subjects pool ---
SUBJECTS=(
  philosophy science design psychology history technology fiction art
  economics biography nature mathematics sociology music architecture
  photography poetry neuroscience anthropology linguistics
)

# --- Shuffle subjects for random selection ---
shuffled_subjects() {
  local arr=("$@")
  local n=${#arr[@]}
  for ((i=n-1; i>0; i--)); do
    local j=$((RANDOM % (i+1)))
    local tmp="${arr[i]}"
    arr[i]="${arr[j]}"
    arr[j]="$tmp"
  done
  echo "${arr[@]}"
}

SHUFFLED=($(shuffled_subjects "${SUBJECTS[@]}"))

# --- Main loop: try subjects until we find a non-duplicate ---
for subject in "${SHUFFLED[@]}"; do
  # Random offset within first 200 results (keep it varied)
  OFFSET=$((RANDOM % 4 * 50))
  API_URL="https://openlibrary.org/subjects/${subject}.json?limit=50&offset=${OFFSET}"

  echo "Trying subject: $subject (offset=$OFFSET)" >&2

  # Fetch subject page
  RESPONSE=$(curl -sf --max-time 15 "$API_URL" 2>/dev/null) || {
    echo "  API request failed for $subject, skipping" >&2
    continue
  }

  # Check we got valid JSON with works
  WORK_COUNT=$(echo "$RESPONSE" | node -pe "
    try {
      const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
      (d.works || []).length;
    } catch(e) { 0 }
  " 2>/dev/null) || WORK_COUNT=0

  if [ "$WORK_COUNT" -eq 0 ]; then
    echo "  No works found for $subject, skipping" >&2
    continue
  fi

  echo "  Found $WORK_COUNT works" >&2

  # Pick a random non-duplicate book from results
  # Note: subject is embedded directly via bash variable substitution
  RESULT=$(echo "$RESPONSE" | node -e "
    const existing = $EXISTING_TITLES;
    const subj = '$subject';
    const catName = subj.charAt(0).toUpperCase() + subj.slice(1);
    const chunks = [];
    process.stdin.on('data', c => chunks.push(c));
    process.stdin.on('end', () => {
      let data;
      try { data = JSON.parse(chunks.join('')); }
      catch(e) { process.exit(1); }

      const works = data.works || [];

      // Shuffle works for variety
      for (let i = works.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [works[i], works[j]] = [works[j], works[i]];
      }

      for (const w of works) {
        const title = (w.title || '').trim();
        if (!title) continue;

        // Fuzzy duplicate check (lowercase)
        const tl = title.toLowerCase();
        const isDupe = existing.some(e => {
          if (e === tl) return true;
          if (e.includes(tl) || tl.includes(e)) return true;
          return false;
        });
        if (isDupe) continue;

        // Extract author
        const authors = (w.authors || []).map(a => a.name || '').filter(Boolean);
        const author = authors[0] || 'Unknown';
        if (author === 'Unknown') continue;

        // Skip non-Latin titles (prefer English)
        if (/[^\\x00-\\x7F]/.test(title) && !/[a-zA-Z]/.test(title)) continue;

        // Extract ISBN from availability
        const isbn = (w.availability && w.availability.isbn) ? w.availability.isbn : '';

        // Description: try excerpt, then generic
        const desc = (w.description && typeof w.description === 'string')
          ? w.description.replace(/\\n/g, ' ').slice(0, 200)
          : (w.description && w.description.value)
            ? w.description.value.replace(/\\n/g, ' ').slice(0, 200)
            : '';

        console.log(JSON.stringify({ title, author, isbn, category: catName, desc, _key: w.key }));
        process.exit(0);
      }

      // All were duplicates
      process.exit(2);
    });
  " 2>/dev/null) && EXIT_CODE=0 || EXIT_CODE=$?

  if [ "$EXIT_CODE" -eq 0 ] && [ -n "$RESULT" ]; then
    # We have a candidate — now enrich with description from work page if missing
    WORK_KEY=$(echo "$RESULT" | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8'))._key" 2>/dev/null || echo "")
    CURRENT_DESC=$(echo "$RESULT" | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).desc" 2>/dev/null || echo "")
    CURRENT_ISBN=$(echo "$RESULT" | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).isbn" 2>/dev/null || echo "")

    if [ -n "$WORK_KEY" ] && { [ -z "$CURRENT_DESC" ] || [ -z "$CURRENT_ISBN" ]; }; then
      echo "  Fetching work details for $WORK_KEY..." >&2
      WORK_DATA=$(curl -sf --max-time 10 "https://openlibrary.org${WORK_KEY}.json" 2>/dev/null) || WORK_DATA=""

      if [ -n "$WORK_DATA" ]; then
        ENRICHED=$(echo "$RESULT" | node -e "
          const chunks = [];
          process.stdin.on('data', c => chunks.push(c));
          process.stdin.on('end', () => {
            let book;
            try { book = JSON.parse(chunks.join('')); }
            catch(e) { process.stdout.write(chunks.join('')); process.exit(0); }

            let work;
            try { work = JSON.parse(process.env.WORK_DATA); }
            catch(e) { console.log(JSON.stringify(book)); process.exit(0); }

            // Enrich description
            if (!book.desc) {
              const d = work.description;
              if (d && typeof d === 'string') book.desc = d.replace(/\\n/g, ' ').slice(0, 200);
              else if (d && d.value) book.desc = d.value.replace(/\\n/g, ' ').slice(0, 200);
            }

            // Enrich ISBN from identifiers
            if (!book.isbn) {
              const ids = work.isbn_13 || work.isbn_10 || [];
              if (ids.length > 0) book.isbn = ids[0];
            }

            delete book._key;
            console.log(JSON.stringify(book));
          });
        " WORK_DATA="$WORK_DATA" 2>/dev/null) || ENRICHED="$RESULT"
        RESULT="$ENRICHED"
      fi
    fi

    # Try to get ISBN from editions if still missing
    FINAL_ISBN=$(echo "$RESULT" | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).isbn" 2>/dev/null || echo "")
    if [ -z "$FINAL_ISBN" ] && [ -n "$WORK_KEY" ]; then
      EDITIONS_DATA=$(curl -sf --max-time 10 "https://openlibrary.org${WORK_KEY}/editions.json?limit=5" 2>/dev/null) || EDITIONS_DATA=""
      if [ -n "$EDITIONS_DATA" ]; then
        ISBN_FROM_EDITIONS=$(echo "$EDITIONS_DATA" | node -pe "
          const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
          const entries = d.entries || [];
          for (const e of entries) {
            const isbns = e.isbn_13 || e.isbn_10 || [];
            if (isbns.length > 0) { process.stdout.write(isbns[0]); process.exit(0); }
          }
          '';
        " 2>/dev/null) || ISBN_FROM_EDITIONS=""

        if [ -n "$ISBN_FROM_EDITIONS" ]; then
          RESULT=$(echo "$RESULT" | node -e "
            const chunks = [];
            process.stdin.on('data', c => chunks.push(c));
            process.stdin.on('end', () => {
              const b = JSON.parse(chunks.join(''));
              b.isbn = process.env.NEW_ISBN;
              delete b._key;
              console.log(JSON.stringify(b));
            });
          " NEW_ISBN="$ISBN_FROM_EDITIONS" 2>/dev/null) || true
        fi
      fi
    fi

    # Clean up internal key if still present
    RESULT=$(echo "$RESULT" | node -e "
      const chunks = [];
      process.stdin.on('data', c => chunks.push(c));
      process.stdin.on('end', () => {
        const b = JSON.parse(chunks.join(''));
        delete b._key;
        console.log(JSON.stringify(b));
      });
    " 2>/dev/null) || true

    echo "  ✓ Found: $(echo "$RESULT" | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).title" 2>/dev/null)" >&2
    echo "$RESULT"
    exit 0
  fi

  echo "  All results for '$subject' were duplicates, trying next subject..." >&2
done

echo "ERROR: Could not find a non-duplicate book after trying all subjects." >&2
exit 1
