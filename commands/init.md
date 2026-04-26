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
   - **Show the baseline picker** — present these four options as a numbered menu and ask the user to pick one:

     ```
     1. Blank — start empty (0 decisions)
     2. ts-saas v0.1 — TypeScript SaaS conventions (18 decisions, free plan)
     3. fintech v0.1 — Fintech compliance + auditability (22 decisions, requires 'pro' plan or higher)
     4. ai-agent v0.1 — AI agent / LLM app conventions (15 decisions, free plan)
     ```

     The version labels (`v0.1`) come from the registry — keep them visible so the user knows which snapshot will be seeded if they audit the project later.

   - Call **`valis_create_project`**:
     - For Blank: pass `project_name` only.
     - For a template: pass `project_name` AND `template_id` (one of `ts-saas` | `fintech` | `ai-agent`).
   - On success the response includes `{ project_id, project_name, role, template_source, decisions_seeded }`. Surface `decisions_seeded` to the user so they know how much was preloaded.
   - **Plan-locked errors**: if the response has `error: 'plan_too_low'`, surface the human-readable `message` to the user and offer to retry with a different template (Blank or another free-tier option). Do not retry blindly.
   - **Quota errors**: if the response has `error: 'plan_quota_exceeded'`, surface the message and offer Blank as a fallback (no decisions seeded).
   - Treat the successful response as the selected project for step 6.

6. Write `.valis.json` to the repo root:
   ```json
   { "project_id": "<id>", "project_name": "<name>" }
   ```

7. Print: "Connected to {project_name}. {decision_count} decisions available." Substitute `decisions_seeded` for templated projects, or 0 for blank ones.
