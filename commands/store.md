---
description: Store a team decision, constraint, pattern, or lesson with guided classification.
argument-hint: "decision description"
---

Store a single team decision, constraint, pattern, or lesson in the Valis knowledge base.

## Steps

1. **Get decision text.** If `$ARGUMENTS` is provided, use it as the decision description. Otherwise, ask: "What decision, constraint, pattern, or lesson do you want to store?"

2. **Classify the entry.** Analyze the text and determine the type:
   - `decision` — a technical choice made between alternatives
   - `constraint` — a limitation imposed by clients, regulations, or infrastructure
   - `pattern` — an established coding convention or architectural pattern
   - `lesson` — a lesson learned from a bug, incident, or experience

3. **Generate metadata:**
   - `summary`: max 100 characters, concise description
   - `affects`: list of modules, components, or areas impacted (e.g., `["api", "auth", "database"]`)

4. **Show classification for confirmation:**
   ```
   Type:    {type}
   Summary: {summary}
   Affects: {affects list}
   Text:    {full description}
   ```
   Ask: "Store this? (y/n)" — proceed on confirmation.

5. **Store.** Call `valis_store` with all fields. One decision per call only.

6. **Confirm.** Print: "Stored {type}: {summary}" with the returned ID.
