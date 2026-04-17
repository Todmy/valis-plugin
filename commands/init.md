---
description: Connect this repository to a Valis project. Creates .valis.json.
argument-hint: "[project-name]"
---

Connect this repository to a Valis project by creating `.valis.json`.

## Steps

1. Read `.valis.json` from the repo root. If it exists, show the current project and ask whether to switch. Stop if the user declines.

2. Call the **`valis_list_projects`** MCP tool to fetch projects the authenticated member can access. Present a numbered list with names, roles, and decision counts.

   Do **not** use `WebFetch`, `Fetch`, or `Bash curl` to hit `/api/list-projects` directly — those tools do not carry the MCP OAuth token and will return 401.

3. If `$ARGUMENTS` matches a project name, select it automatically. Otherwise ask the user to pick.

4. Write `.valis.json` to the repo root:
   ```json
   { "project_id": "<id>", "project_name": "<name>" }
   ```

5. Print: "Connected to {project_name}. {decision_count} decisions available."
