---
description: Extract team decisions from a folder of documents using AI analysis. Estimates token cost before proceeding.
argument-hint: "folder path"
---

Analyze documents in a folder and extract team decisions, constraints, patterns, and lessons into Valis.

## Steps

1. **Get folder path.** If `$ARGUMENTS` is provided, use it as the folder path. Otherwise, ask: "Which folder should I analyze?"

2. **Estimate cost.** Run the estimation script via Bash:
   ```bash
   bash ${CLAUDE_PLUGIN_ROOT}/scripts/estimate-tokens.sh <folder_path>
   ```
   Parse the JSON output.

3. **Show estimate and confirm:**
   ```
   Files:            {file_count}
   Total size:       {total_bytes} bytes
   Estimated tokens: {estimated_tokens}
   Token range:      {range}
   ```
   Ask: "Proceed with extraction? (y/n)". Stop if the user declines.

4. **Process each file.** For every text file in the folder:
   - If the file is larger than 100KB, split it into ~50KB segments and process each segment separately
   - Read the file content
   - Analyze it for team decisions, constraints, patterns, and lessons
   - For each identified item, call `valis_store` separately (one call per decision)
   - Include the source file path in the stored entry for traceability

5. **Track progress.** After each file, briefly report: "Processed {filename}: found {N} decisions."

6. **Final report:**
   ```
   Extraction complete.
   Files processed: {M}
   Decisions stored: {N total}
   Files with no decisions: {K}
   ```
   List the files that had no extractable decisions so the user can review them manually if needed.
