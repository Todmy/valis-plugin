---
description: Connect this repository to a Valis project. Creates .valis.json.
argument-hint: "[project-name]"
---

Connect this repository to a Valis project by creating `.valis.json`.

## Steps

1. Read `.valis.json` from the repo root. If it exists, show the current project and ask whether to switch. Stop if the user declines.

2. Call the **`valis_list_projects`** MCP tool to fetch projects the authenticated member can access.

   Do **not** use `WebFetch`, `Fetch`, or `Bash curl` to hit `/api/list-projects` directly — those tools do not carry the MCP OAuth token and will return 401.

3. Present a numbered list with names, roles, and decision counts. **Always include one additional option at the end**: `N+1. Create a new project` (where N is the number of existing projects).

4. If `$ARGUMENTS` matches an existing project name, select it automatically. Otherwise ask the user to pick by number or name.

5. **If user picks "Create a new project"** (or equivalent):
   - Ask for the project name. Suggest the current repo directory basename as a default.
   - Call the **`valis_create_project`** MCP tool with `project_name`. It returns `{ project_id, project_name, role }`.
   - Treat the response as the selected project for step 6.

6. Write `.valis.json` to the repo root:
   ```json
   { "project_id": "<id>", "project_name": "<name>" }
   ```

7. Print: "Connected to {project_name}. {decision_count} decisions available." (use 0 for newly created projects).
