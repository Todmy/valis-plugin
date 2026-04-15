---
# TEMPLATE: Copy this file to create a new Valis command.
# File name becomes the command name: my-command.md -> /valis:my-command
#
# Required frontmatter:
#   description  — one sentence shown in /valis:help listings
#
# Optional frontmatter:
#   argument-hint — placeholder shown after the command name (e.g. "search query")
#
# Convention: every command that calls a Valis MCP tool should start with
# a "Check project config" step that reads .valis.json and passes project_id
# to scope the operation. See search.md or store.md for examples.
#
# Available MCP tools:
#   valis_context   — load decisions relevant to a task description
#   valis_search    — semantic search across the knowledge base
#   valis_store     — persist a new decision/constraint/pattern/lesson
#   valis_lifecycle — change decision status (promote/deprecate/supersede)
#
# Available environment variables in hooks/scripts:
#   $CLAUDE_PLUGIN_ROOT — path to this plugin's root directory
#   $CLAUDE_PLUGIN_DATA — writable directory for plugin state
#   $CLAUDE_PROJECT_DIR — path to the user's project root
#
description: Short description of what this command does.
argument-hint: "optional argument placeholder"
---

Brief explanation of what this command does and when to use it.

## Steps

1. **Check project config.** Read `.valis.json` from the repository root.
   - If it exists, use its `project_id` when calling Valis MCP tools.
   - If missing, proceed without project scoping.

2. **Get input.** Use `$ARGUMENTS` if provided. Otherwise, ask the user.

3. **Execute.** Call the appropriate Valis MCP tool(s).

4. **Confirm.** Display the result to the user.
