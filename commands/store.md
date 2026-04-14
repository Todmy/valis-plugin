---
description: Store a team decision, constraint, pattern, or lesson.
argument-hint: "decision description"
---

Store one entry in the Valis knowledge base.

## Steps

1. Use `$ARGUMENTS` as the description. If empty, ask: "What do you want to store?"

2. Classify as one of: `decision`, `constraint`, `pattern`, `lesson`.

3. Generate: `summary` (max 100 chars), `affects` (list of impacted modules).

4. Show the classification and ask "Store this? (y/n)":
   ```
   Type:    {type}
   Summary: {summary}
   Affects: {affects}
   ```

5. Call `valis_store` with all fields. One entry per call.

6. Print: "Stored {type}: {summary}" with the returned ID.
