---
description: Change decision status — promote, deprecate, or supersede team decisions.
argument-hint: "promote|deprecate|supersede [search query or decision ID]"
---

Transition a team decision through its lifecycle: promote (draft -> active), deprecate (active -> deprecated), or supersede (active -> superseded, with a link to its replacement).

## Steps

1. **Parse action.** Extract the lifecycle action from `$ARGUMENTS`:
   - If `$ARGUMENTS` starts with `promote`, `deprecate`, or `supersede`, use that as the action and the rest as the query.
   - If no recognized action, ask: "What do you want to do? (promote / deprecate / supersede)"

2. **Find the decision.** Call `valis_search` with the remaining query text.
   - If multiple results are returned, show them numbered and ask the user to pick one.
   - If no results, suggest refining the search.

3. **Confirm current state.** Display the selected decision:
   ```
   [{type}] {summary}
   Status:  {current_status}
   Stored:  {created_at}
   ```

4. **Validate transition.** Check the action is valid for the current status:
   - `promote`: valid from `draft` -> `active`
   - `deprecate`: valid from `active` -> `deprecated`
   - `supersede`: valid from `active` -> `superseded` (requires a replacement)
   
   If the transition is invalid, explain why and suggest the correct action.

5. **Gather details for supersede.** If the action is `supersede`:
   - Ask: "What decision supersedes this one?" and search for or accept a new decision description.
   - If the replacement does not exist yet, offer to create it via `valis_store` first.

6. **Execute.** Call `valis_lifecycle` with the decision ID, new status, and (for supersede) the replacement decision ID.

7. **Confirm.** Print: "{Action} complete: '{summary}' is now {new_status}."
   For supersede, also show: "Superseded by: '{replacement_summary}'"
