---
name: valis-import
description: Bulk-import an existing folder of architectural notes (markdown specs, ADRs, RFCs) into the team brain. One file = one decision; chunking handled automatically at indexing time.
---

# Bulk import existing docs

Use when the user has an existing `docs/`, `specs/`, or similar folder of
architectural notes and wants the team brain bootstrapped from them.
Common at first-time onboarding or after a migration from another tool.

## Procedure

1. **Identify the folder** the user wants to import. If unclear, ask:
   "Which folder? Common picks: `./docs`, `./specs`, `./adr`."

2. **Preview before import** — show the user what will happen:
   - Count `.md` / `.markdown` files in the folder
   - Sample 3-5 filenames so they recognize what's about to be indexed
   - Note: each file becomes ONE decision (chunking happens internally
     for retrieval, but at the decision level it's 1:1)

3. **Filename type inference** — Valis auto-classifies based on prefix:
   - `decision-*.md` → type=decision, status=active
   - `pattern-*.md` → type=pattern, status=active
   - `constraint-*.md` → type=constraint, status=active
   - `lesson-*.md` / `postmortem-*.md` → type=lesson, status=active
   - Other names → type=decision, **status=proposed** (drafts queue)

   Tell the user: "Files without a recognized prefix will land as
   `proposed` for triage. If they're completed records (not drafts),
   either rename with prefix OR plan to bulk-promote after import."

4. **Run the import** via CLI command (NOT a tool call — this needs
   filesystem access):
   ```
   valis index <folder>
   ```
   For non-interactive scripted runs, suggest `--yes` flag.

5. **After import completes**, surface:
   - How many decisions were stored
   - How many landed as `proposed` (drafts queue)
   - Suggest next step: review the `/proposed` dashboard view, or use
     `valis-triage` skill to walk through them.

6. **Optional enrichment** — if the user opts in, Haiku will classify
   type/affects/confidence for each decision. Cost preview shown before
   confirmation. ~$0.18 per 1k drafts.

## Don't

- Don't run import without preview — bulk-storing 100+ decisions
  unsupervised pollutes the brain.
- Don't import files that aren't durable architectural records — chat
  logs, todo lists, meeting notes belong elsewhere.
- Don't enrich without the user confirming the cost estimate.

## Why this matters

First-time team brain bootstrap is a one-shot opportunity. If you import
sloppy or duplicate files, every search result for the next 6 months
will surface the noise. Better to import 50 well-curated decisions than
500 unfiltered files.
