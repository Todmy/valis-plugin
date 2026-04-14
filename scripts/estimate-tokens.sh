#!/usr/bin/env bash
# Estimate token count for text files in a folder.
# Outputs JSON: {"total_bytes": N, "file_count": N, "estimated_tokens": N, "range": "..."}

set -euo pipefail

if [ $# -lt 1 ]; then
  echo '{"error": "Usage: estimate-tokens.sh <folder-path>"}' >&2
  exit 1
fi

FOLDER="$1"

if [ ! -d "$FOLDER" ]; then
  echo "{\"error\": \"Directory not found: $FOLDER\"}" >&2
  exit 1
fi

# Supported text file extensions
EXTENSIONS=(
  "*.md" "*.txt" "*.ts" "*.js" "*.py" "*.json" "*.yaml" "*.yml"
  "*.toml" "*.cfg" "*.ini" "*.sh" "*.html" "*.css" "*.sql"
  "*.go" "*.rs" "*.java" "*.rb" "*.php" "*.swift" "*.kt"
)

# Build find arguments
FIND_ARGS=()
for i in "${!EXTENSIONS[@]}"; do
  if [ "$i" -gt 0 ]; then
    FIND_ARGS+=("-o")
  fi
  FIND_ARGS+=("-name" "${EXTENSIONS[$i]}")
done

# Count files and total bytes
TOTAL_BYTES=0
FILE_COUNT=0

while IFS= read -r file; do
  if [ -f "$file" ]; then
    SIZE=$(wc -c < "$file")
    TOTAL_BYTES=$((TOTAL_BYTES + SIZE))
    FILE_COUNT=$((FILE_COUNT + 1))
  fi
done < <(find "$FOLDER" -type f \( "${FIND_ARGS[@]}" \))

# Approximate tokens (1 token ~ 4 bytes)
ESTIMATED_TOKENS=$((TOTAL_BYTES / 4))

# Determine range
if [ "$ESTIMATED_TOKENS" -lt 10000 ]; then
  RANGE="0-10K"
elif [ "$ESTIMATED_TOKENS" -lt 50000 ]; then
  RANGE="10-50K"
elif [ "$ESTIMATED_TOKENS" -lt 100000 ]; then
  RANGE="50-100K"
elif [ "$ESTIMATED_TOKENS" -lt 200000 ]; then
  RANGE="100-200K"
else
  RANGE="200K+"
fi

echo "{\"total_bytes\": ${TOTAL_BYTES}, \"file_count\": ${FILE_COUNT}, \"estimated_tokens\": ${ESTIMATED_TOKENS}, \"range\": \"${RANGE}\"}"
