#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

DRY_RUN=0
if [ "${1:-}" == "--dry-run" ]; then
    DRY_RUN=1
    echo "=== DRY RUN MODE ==="
fi

if [ ! -f "queue.json" ] || [ "$(jq 'length' queue.json)" -eq 0 ]; then
    echo "ERROR: queue.json is empty or missing!"
    exit 1
fi

# 1. Pop the first book
BOOK_JSON=$(jq '.[0]' queue.json)
REMAINING_JSON=$(jq '.[1:]' queue.json)

# 2. Calculate next date from data.js
LATEST_DATE=$(grep 'date:' data.js | tail -1 | grep -o '"[^"]*"' | tr -d '"')
NEXT_DATE=$(date -j -v+1d -f "%Y-%m-%d" "$LATEST_DATE" "+%Y-%m-%d" 2>/dev/null || date -d "$LATEST_DATE + 1 day" "+%Y-%m-%d")

echo "Adding entry for $NEXT_DATE:"
echo "$BOOK_JSON" | jq -r '.title + " by " + .author'

# 3. Format the new entry
NEW_ENTRY=$(BOOK_JSON_ENV="$BOOK_JSON" NEXT_DATE_ENV="$NEXT_DATE" node -e '
const book = JSON.parse(process.env.BOOK_JSON_ENV);
const date = process.env.NEXT_DATE_ENV;
const esc = (s) => JSON.stringify(String(s)).slice(1, -1).replace(/\\"/g, "\\\"");
process.stdout.write(`    {
        date: "${date}",
        book: {
            isbn: "${esc(book.isbn)}",
            title: "${esc(book.title)}",
            author: "${esc(book.author)}",
            category: "${esc(book.category)}",
            desc: "${esc(book.desc)}"
        },
        quote: {
            text: "${esc(book.quote.text)}",
            source: "${esc(book.quote.source)}"
        }
    }`);
')

if [ "$DRY_RUN" -eq 1 ]; then
    echo "--- WOULD INSERT ---"
    echo "$NEW_ENTRY"
    echo "--------------------"
    echo "Remaining in queue: $(echo "$REMAINING_JSON" | jq 'length')"
    exit 0
fi

# 4. Insert into data.js — replace closing `];` with new entry + `];`
export NEW_ENTRY
node -e '
const fs = require("fs");
let s = fs.readFileSync("data.js", "utf8");
const entry = process.env.NEW_ENTRY;
s = s.replace(/\n(\s*)\}\n\];/, "\n$1},\n" + entry + "\n];");
fs.writeFileSync("data.js", s);
'

# 5. Update queue
echo "$REMAINING_JSON" > queue.json

# 6. Validate
./scripts/validate-js.sh data.js

# 7. Commit & Push
git add data.js queue.json
git commit -m "chore(content): add daily entry for $NEXT_DATE"
git push

echo "Successfully added entry and pushed."
