---
name: valis-recall
description: Search across all accessible projects when scoped search returns nothing. Catches the "decided in another project" silent-miss case that single-scope search misses.
---

# Cross-project recall

Use when scoped `valis_search` returned 0 results, OR when the user
explicitly asks "знайди в усіх проєктах", "search everywhere", "across
all my projects".

## Procedure

1. **Identify the topic** from user's question (same as `valis-find`).

2. **Try active project first** (cheap, fast):
   ```
   valis_search({ query: <topic>, limit: 10 })
   ```

3. **If 0 results OR user explicitly asked for cross-project** —
   re-search with `all_projects: true`:
   ```
   valis_search({ query: <topic>, all_projects: true, limit: 10 })
   ```

4. **Always announce scope** to the user:
   - "No results in active project. Searched all accessible — found N."
   - "Searched all accessible projects (you have access to M). Top
     results from project '<name>'..."

5. **For results from other projects**, surface the project name
   prominently — `result.project_name` is included in cross-project
   responses. Example:
   ```
   [valis] Implementation Plan: OAuth 2.1 for Valis MCP Connector (proposed)
   [pbaas] AI Gateway authentication via VERCEL_OIDC_TOKEN (active)
   ```

6. **If user wanted only active project** — flag the cross-project
   match as "found in another project, not active scope. Switch
   project? Or pull the relevant content over?"

## Don't

- Don't silently fall back to `all_projects: true` without telling the
  user — they need to know which scope produced the result.
- Don't conclude "decision doesn't exist" from a single scoped search —
  always check cross-project before declaring absence.
- Don't return cross-project results without showing project_name —
  users get confused which project a finding belongs to.

## Why this matters

This is the **silent wrong-scope failure mode** that erodes trust most
quickly. User asks "як ми вирішили auth" → agent searches scoped to
active project → returns 0 → reports "no decisions on auth" → user
thinks the team brain is broken or the decision was never recorded.

Reality: the decision was in another project the user has access to.
This skill makes that explicit, not silent.
