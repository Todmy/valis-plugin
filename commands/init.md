---
description: Connect this repository to a Valis project. Creates .valis.json.
argument-hint: "[project-name]"
---

Connect this repository to a Valis project by creating a `.valis.json` config file.

## Steps

1. **Check existing config.** Read `.valis.json` in the repository root.
   - If it exists, display the current `project_name` and `project_id`, then ask: "Already connected to {project_name}. Switch to a different project? (y/n)". If the user says no, stop.

2. **Fetch available projects.** Use `WebFetch` to GET `https://valis.krukit.co/api/list-projects`. If that fails, call `valis_search` with a broad query like "project" to discover available projects.

3. **Present project list.** Show a numbered list:
   ```
   1. Project Alpha (142 decisions)
   2. Project Beta (89 decisions)
   ...
   ```

4. **Get user selection.** Ask the user to pick a number or type a project name. If `$ARGUMENTS` was provided and matches a project name, select it automatically without prompting.

5. **Write config file.** Create `.valis.json` in the repository root with:
   ```json
   {
     "project_id": "<selected_project_id>",
     "project_name": "<selected_project_name>"
   }
   ```

6. **Confirm.** Print: "Connected to {project_name}. {decision_count} team decisions are now available."
