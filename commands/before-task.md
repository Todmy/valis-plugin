---
description: Load relevant team context before starting a task.
argument-hint: "task description"
---

Load team decisions, constraints, and patterns relevant to a planned task.

## Steps

1. Use `$ARGUMENTS` as the task description. If empty, ask: "What task are you about to start?"

2. Call `valis_context` with `task_description` set to the provided text.

3. Group results by type: **Decisions**, **Constraints**, **Patterns**, **Lessons**. Show summaries for each.

4. If any existing decisions or constraints conflict with the planned task, flag them:
   ```
   WARNING: Conflict with "{decision summary}" — {explanation}
   ```

5. End with "Key things to keep in mind" — top 3-5 items that directly affect this task.
