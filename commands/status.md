---
description: Show Valis connection status, auth state, project info, and decision count.
---

Display the current Valis connection status and project information.

## Steps

1. **Check local config.** Read `.valis.json` from the repository root.
   - If missing, report: "Not configured. Run /valis:init to connect a project."

2. **Test connection.** Call `valis_context` to verify the MCP server is reachable and authenticated.
   - If the call fails, report: "Connection: not connected" and show the error.

3. **Display status summary:**
   ```
   Project:        {project_name}
   Project ID:     {project_id}
   Connection:     connected / not connected
   Auth:           authenticated / not authenticated
   Role:           {user role from context, if available}
   Decisions:      {count}
   Contradictions: {open contradictions count, if available}
   ```

4. If any issues are detected (missing config, auth failure, connection error), suggest the appropriate fix command.
