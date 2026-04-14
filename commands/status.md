---
description: Show Valis connection status, project info, and decision count.
---

Show current Valis connection status.

## Steps

1. Read `.valis.json` from the repo root. If missing: "Not configured. Run /valis:init to connect."

2. Call `valis_context` to verify the MCP connection is live.

3. Display:
   ```
   Project:        {project_name}
   Project ID:     {project_id}
   Connection:     connected / not connected
   Decisions:      {count}
   Contradictions: {open count, if available}
   ```

4. On any failure, suggest the fix (e.g., `/valis:init` for missing config).
