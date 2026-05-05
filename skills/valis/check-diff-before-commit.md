---
name: valis-check
description: Run shift-left enforcement against working-tree diff before commit. Surfaces decision violations that would block at PR time — fix them now instead of after CI fails.
---

# Check diff before commit

Use when the user says "перевір зміни", "check my diff", "ready to
commit", or proactively before the agent itself commits non-trivial
changes.

## Procedure

1. **Verify git context**:
   ```
   git rev-parse --is-inside-work-tree
   ```
   If not in a repo: tell user "this skill needs a git repository" and
   stop.

2. **Capture the diff**:
   - Default: `git diff HEAD` (unstaged + staged combined)
   - If user said "staged" / "--cached": `git diff --cached`

3. **If diff is empty**: "Working tree is clean — nothing to check."
   Stop here.

4. **Call the check**:
   ```
   valis_check_diff({
     diff: <captured diff text>,
     metadata: { actor: "<agent in IDE>" }
   })
   ```
   Do NOT pass `pr_url` — its absence is what classifies this as
   in-session (vs PR-time from GitHub Action).

5. **Forward results verbatim** — the tool produces:
   - One-line summary (counts + decisions evaluated + elapsed)
   - One block per violation (file:line — severity — decision title — rationale)
   - Footer tip when block-severity violations exist

6. **If any violation has `severity: block`**, ask user:
   "Want help fixing the block-severity violations, or do you want to
   acknowledge them with `[valis-ack: <decision_id>]` in the commit
   message?"

## Don't

- Don't summarize the tool's response — pass it through. The tool
  already formats violations for human reading.
- Don't suggest auto-fixing without user confirmation — violations may
  be intentional overrides.
- Don't run if diff is empty — wastes a tool call and confuses output.

## Why this matters

CI fails 5 minutes after push. In-session check fails before commit.
Same Haiku-driven detector, same decisions evaluated, but now feedback
loop is 30 seconds instead of 5+ minutes. Plus you can ack-or-fix in
context, while the change is still warm.
