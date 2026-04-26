---
description: Run the team's enforcement check against your working-tree diff before committing.
argument-hint: "(optional) extra context — e.g. 'staged only'"
---

Shift-left enforcement: run the same decision-violation check that runs at PR time, against the changes in your working tree.

## Steps

1. Verify a git repository is present:
   ```
   git rev-parse --is-inside-work-tree
   ```
   If the command fails or returns anything other than `true`, reply:
   > This command requires a git repository. Run it from inside your project.
   And stop here.

2. Capture the diff. Default = working tree vs HEAD. If `$ARGUMENTS` contains the words `staged` or `--cached`, use staged-only.
   - Default: `git diff HEAD`
   - Staged-only: `git diff --cached`

3. If the resulting diff is empty (only whitespace), reply:
   > Working tree is clean — nothing to check.
   And stop here.

4. Call the `valis_check_diff` MCP tool with:
   - `diff` — the full diff text from step 2
   - `metadata.actor` — `"<author> in IDE"` if you know the user; otherwise omit

   Do **NOT** pass `pr_url` — its absence is what classifies this as an in-session check (vs the PR-time check from the GitHub Action).

5. Forward the tool's response to the user verbatim. The tool already produces human-readable blocks:
   - one-line summary (counts + decisions evaluated + elapsed)
   - one block per violation (file:line — severity — decision title — rationale)
   - a footer tip when block-severity violations exist

6. After delivering the response, if any violation has `severity: block`, ask:
   > Want help fixing the block-severity violations, or do you want to acknowledge them with `[valis-ack: <decision_id>]` in the commit message?

   Otherwise, end without further prompting.
