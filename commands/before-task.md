---
description: Load relevant team context before starting a task. Searches decisions by task description.
argument-hint: "task description"
---

Load all relevant team decisions, constraints, and patterns before starting a new task.

## Steps

1. **Get task description.** Use `$ARGUMENTS` as the task description. If empty, ask: "What task are you about to start?"

2. **Load context.** Call `valis_context` with `task_description` set to the provided text. This retrieves decisions, constraints, and patterns relevant to the planned work.

3. **Display relevant context.** Group results by type:

   **Decisions:**
   - {decision summaries with status}

   **Constraints:**
   - {constraint summaries — these MUST be respected}

   **Patterns:**
   - {established patterns to follow}

   **Lessons:**
   - {past lessons relevant to this work}

4. **Flag conflicts.** If any existing decisions or constraints conflict with the planned task, highlight them clearly:
   ```
   WARNING: Potential conflict with existing decision:
   "{decision summary}" — {explain the conflict}
   ```

5. **Summarize.** End with a brief "Key things to keep in mind" list — the top 3-5 most important items from the loaded context that directly affect the planned task.
