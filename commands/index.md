---
description: Bulk-import a folder of markdown documentation as decisions (drafts queue for unprefixed files).
argument-hint: "<folder> (e.g. ./docs or ./specs)"
---

Take an existing tree of markdown files and seed Valis with their content in one shot, instead of typing each decision via `/valis:store`. Files with a recognized prefix (`decision-`, `pattern-`, `constraint-`, `lesson-`, `postmortem-`) are stored as `active` with the inferred type. Files without a prefix are stored as `proposed` drafts so you can triage them in the dashboard before they enter the active set.

## Steps

1. Resolve the target folder from `$ARGUMENTS`.
   - If empty, ask: "Which folder should I index? (e.g. ./docs, ./specs)"
   - If the value is a relative path, resolve it against `$CLAUDE_PROJECT_DIR` if that env var is set; otherwise against the current working directory.
   - If the path doesn't exist or is not a directory, say so and stop.

2. Detect whether the local `valis` CLI is available:
   ```
   valis --version
   ```
   - If the command succeeds and reports `0.1.3` or higher, **prefer the CLI path** (step 3) — it streams progress, uses the same chunking + e5-small embedding pipeline as `valis_store`, and applies all the heuristic + status logic in one place.
   - If the command fails OR reports an older version, fall back to the plugin-native path (step 4) and tell the user once: "valis CLI not found (or older than 0.1.3). Falling back to per-file `valis_store` calls — this is slower but produces the same result. Install the CLI for faster bulk imports: `npm i -g valis-cli@latest`."

3. **CLI path** — shell out:
   - Default invocation: `valis index <folder> --strategy section --use-git --yes` (section-split + git author/date + skip the per-question prompts).
   - If the user's `$ARGUMENTS` already contains flags (e.g. they typed `./specs --strategy file`), forward them verbatim instead of using the defaults.
   - Stream the CLI's stdout/stderr to the user as it runs. The CLI's preview + final summary are already user-friendly.
   - Once it finishes, summarize for the user: "Stored N decisions, M as active, K as proposed drafts (review in the dashboard)."
   - End the command.

4. **Plugin-native path** — run when CLI is absent. This path takes longer (one MCP call per file) so confirm with the user first:
   - Use `Glob` to enumerate `**/*.md` and `**/*.markdown` under the folder (respect `.gitignore` — do not descend into `node_modules`, `dist`, or dot-prefixed dirs).
   - For each file:
     - Read its content. Skip empty files.
     - Infer type from filename: `decision-*` → `decision`, `pattern-*` → `pattern`, `constraint-*` → `constraint`, `lesson-*` / `postmortem-*` → `lesson`, otherwise `decision` + flag as draft.
     - Extract the H1 (line starting with `# `) as the summary; truncate to 100 chars. If no H1, use the filename without extension.
     - Call `valis_check_duplicate` with the first 1000 chars of the body. If a result with similarity ≥ 0.85 already exists, skip the file and add it to a `skipped_dupes[]` list.
     - Otherwise call `valis_store` with: `text` (full body), `type` (inferred), `summary` (extracted), `affects` (empty unless the user passed a tag prefix in `$ARGUMENTS`), `status` (`'active'` if prefix matched, `'proposed'` otherwise).
   - After every 10 files, print a progress line: "Stored 30/87 (24 active, 6 drafts)…"
   - At the end, report the same summary as the CLI path, plus the count of skipped duplicates.

5. After either path completes, if any `proposed` drafts were created, suggest:
   > Drafts are awaiting your review. Open the dashboard ({org}.krukit.co/projects/{project}/proposals) or run `/valis:lifecycle promote <id>` per draft.

## Notes

- Both paths write the same fields into Postgres + Qdrant; only the speed differs.
- The CLI path is the canonical one. The plugin-native fallback exists so brand-new plugin users (who haven't installed the CLI) aren't blocked from bulk-importing.
- Per BACKLOG #147 the plugin-native path doesn't yet implement: `--resume-from`, batch rollback, similarity-based pre-import audit. For now if any of those matter, point the user at the CLI.
