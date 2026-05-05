---
name: valis-triage
description: Walk the proposals queue and triage each draft — promote to active, deprecate, or refine. Essential after bulk-import or after agentic capture has accumulated drafts.
---

# Triage the proposals queue

Use after `valis-import`, after a long agent session that captured many
proposals, or whenever the `/proposed` queue grows beyond 10-20 items.

## Procedure

1. **Fetch the queue** — search with type filter and status filter:
   ```
   valis_search({ query: "*", limit: 50, type: undefined })
   ```
   Then filter client-side for `status: 'proposed'` (the search result
   includes `status_label`).

   Or direct user to dashboard `/proposed` if visual triage is faster.

2. **Group by topic** before walking — use `affects` field or summary
   keywords to cluster related drafts. Walking 50 unrelated proposals
   is unfocused; 50 grouped into 6 topics is tractable.

3. **For each draft**, present a one-line summary and ask:
   ```
   [P] [decision] "Use HTTP MCP transport for plugin" (no affects, 0 deps)
       Promote to active / Deprecate / Skip / Edit summary?
   ```

4. **Apply the user's choice**:
   - **Promote**: `valis_lifecycle({ action: 'promote', decision_id: <id> })`
   - **Deprecate**: `valis_lifecycle({ action: 'deprecate', decision_id: <id>, reason: <user reason or "stale draft"> })`
   - **Skip**: leave it, move to next
   - **Edit**: bring up full body, let user revise, then re-store

5. **After each batch of 10**, summarize: "Triaged 10. Promoted: 4,
   deprecated: 5, skipped: 1. Continue?" — give user a clean exit point.

6. **At end** — surface what's left: "Queue now has N proposed.
   Recommend revisiting in [time] or after [trigger]."

## Don't

- Don't auto-promote without confirmation — even bulk operations need
  per-item user judgment for non-prefixed drafts.
- Don't promote drafts with empty `affects` — they'll be hard to
  discover later. Either tag them at promote time or deprecate.
- Don't process more than ~20 in one session — triage fatigue degrades
  judgment. Better to do 20 well than 50 sloppy.

## Why this matters

Proposals queue is a liability if it just grows. Each unreviewed draft:
- Pollutes search results (deprecated/active are filtered, proposed are mixed in)
- Creates "we already decided that" false positives
- Erodes trust ("the dashboard says we have 184 proposed, are any of them real?")

Regular triage keeps the team brain a useful retrieval surface, not an
accumulating inbox.
