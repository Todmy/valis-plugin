---
name: valis-capture
description: Capture an architectural decision into the team brain. Run after any non-obvious technical choice — pattern adopted, constraint identified, lesson learned. Dedup-checks before storing so near-duplicates don't accumulate.
---

# Capture an architectural decision

Use when the user says "запам'ятай", "save this", "store this decision",
"remember", or after the agent itself makes a load-bearing choice.

## Procedure

1. **Classify the decision type** based on the content:
   - `decision` — a specific technical choice between alternatives
   - `constraint` — a rule that must be respected (client/regulatory/infra)
   - `pattern` — a reusable solution shape
   - `lesson` — a non-obvious learning from a bug or incident

2. **Draft a summary** — one sentence, max 100 chars, what + why.

3. **Check for duplicates** before storing:
   ```
   valis_check_duplicate({ summary, text })
   ```
   If response contains near-duplicates with similarity > 0.85, ask the
   user: "Found similar existing decision: [summary]. Update that one
   instead, or store as new?"

4. **Store** with enriched metadata:
   ```
   valis_store({
     type: <classified>,
     summary: <one-sentence>,
     text: <full body with reasoning + alternatives + tradeoffs>,
     affects: [<area1>, <area2>],   // domain tags
     status: 'active',              // skip 'proposed' triage queue when confident
     confidence: 0.8                // 0–1 float (NOT 1–10)
   })
   ```

5. **Confirm to user** with the returned `id` so they can reference it
   later. Mention if it was stored as `proposed` (default) vs `active`.

## Don't

- Don't store every chat exchange — only durable decisions worth recall.
- Don't skip dedup check — duplicate decisions clutter search results.
- Don't pass `confidence` as integer 1–10 — schema is float 0–1.

## Why this matters

Decisions stored without this skill often miss:
- Type classification (search filters won't find them)
- `affects` tags (no domain-scoped retrieval)
- Reasoning + alternatives (just the conclusion, not the why)

Result: the team brain accumulates noise — entries that are technically
"stored" but not retrievable when needed.
