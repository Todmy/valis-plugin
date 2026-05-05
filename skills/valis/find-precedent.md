---
name: valis-find
description: Before adding a new architectural pattern, search for existing related decisions, constraints, and patterns. Surface top-3 with summaries so the team doesn't reinvent or contradict itself.
---

# Find precedent before adding new patterns

Use when the user says "як ми робили", "how did we handle", "what's
the team's approach to", or when about to make a non-trivial
architectural choice.

## Procedure

1. **Extract the topic** from user's question. Examples:
   - "як ми вирішували auth" → topic = "authentication strategy"
   - "як ми робимо retry logic" → topic = "retry policy patterns"

2. **Search the team brain** — start scoped to active project:
   ```
   valis_search({ query: <topic>, limit: 10 })
   ```

3. **If results are empty** — DO NOT conclude "no precedent exists"
   silently. Retry with `all_projects: true`:
   ```
   valis_search({ query: <topic>, all_projects: true, limit: 10 })
   ```
   And tell the user: "Nothing in this project. Searched all accessible
   projects — found N results / still nothing."

4. **Filter and rank** the results:
   - Keep `status: 'active'` first
   - Surface deprecated/superseded only if relevant to the question
   - Cap at top-3 unless user asks for more

5. **Present findings** as:
   - One-sentence summary per decision
   - Status badge ([active], [proposed], [deprecated])
   - The decision ID (so user can pull full body via `valis_search` with
     `expand: 'full'` if needed)

6. **If precedent contradicts what user is about to do** — flag it:
   "Heads up: [decision X] says we DON'T do this because [reason]. Are
   you intentionally overriding that, or did the context change?"

## Don't

- Don't search before classifying the topic — broad queries return noise.
- Don't accept empty scoped results as "no precedent" — always check
  `all_projects` before announcing absence.
- Don't list more than top-3 unless asked — long lists are skim-prone
  and bury the most relevant entries.

## Why this matters

The single biggest team-brain failure mode is: agent reinvents a pattern
the team decided 6 months ago, OR worse, contradicts a deprecation
decision because the deprecated entry didn't surface in the agent's
scoped search. This skill catches both — by searching before deciding,
and by widening scope when scoped returns 0.
