---
description: Extract team decisions from a folder of documents. Estimates token cost first.
argument-hint: "folder path"
---

Analyze documents in a folder and extract decisions, constraints, patterns, and lessons into Valis.

## Steps

1. Use `$ARGUMENTS` as the folder path. If empty, ask: "Which folder should I analyze?"

2. Estimate cost:
   ```bash
   bash ${CLAUDE_PLUGIN_ROOT}/scripts/estimate-tokens.sh <folder_path>
   ```

3. Show the estimate (files, bytes, tokens, range). Ask "Proceed? (y/n)". Stop if declined.

4. For each text file:
   - Read its content (split files >100KB into ~50KB segments)
   - Extract decisions, constraints, patterns, lessons
   - Call `valis_store` once per item, including source file path
   - Report: "Processed {filename}: {N} items found."

5. Final summary: files processed, total items stored, files with nothing extracted.
