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
NEW_ENTRY=$(node -e "
const book = $BOOK_JSON;
const date = '$NEXT_DATE';
console.log(\`    },
    {
        date: \"\${date}\",
        book: {
            isbn: \"\${book.isbn}\",
            title: \"\${book.title}\",
            author: \"\${book.author}\",
            category: \"\${book.category}\",
            desc: \"\${book.desc}\"
        },
        quote: {
            text: \"\${book.quote.text}\",
            source: \"\${book.quote.source}\"
        }\`);
")

if [ "$DRY_RUN" -eq 1 ]; then
    echo "--- WOULD INSERT ---"
    echo "$NEW_ENTRY"
    echo "--------------------"
    echo "Remaining in queue: $(echo "$REMAINING_JSON" | jq 'length')"
    exit 0
fi

# 4. Insert into data.js (replace the last `    }` before `];`)
# We find the last `    }` and replace it with our new entry + closing `    }`
awk -v entry="$NEW_ENTRY" '
    /\];/ { if (!done) { print entry"\n    }\n];"; done=1; next } }
    { if (done) print; else lines[NR]=$0 }
    END {
        for(i=1; i<=NR-2; i++) if(lines[i]) print lines[i]
        if (!done) print entry"\n    }\n];"
    }
' data.js > data.js.tmp && mv data.js.tmp data.js

# 5. Update queue
echo "$REMAINING_JSON" > queue.json

# 6. Validate
./scripts/validate-js.sh data.js

# 7. Commit & Push
git add data.js queue.json
git commit -m "chore(content): add daily entry for $NEXT_DATE"
git push

echo "Successfully added entry and pushed."
