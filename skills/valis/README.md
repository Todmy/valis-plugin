# Valis Skills (cross-harness)

Cross-harness procedural-knowledge files for Valis. These work in any
runtime that honors the AAIF SKILL.md spec (Anthropic-donated December
2025): Claude Code, Cursor, Codex, Gemini CLI, Goose, OpenCode.

For **claude.ai web** users: copy any SKILL.md content into the
`/skill-creator` flow and the skill becomes available as a slash command
in your `/` picker.

## Skills

| File | Purpose |
|---|---|
| `capture-decision.md` | When something architectural is decided — dedup-check + store. |
| `find-precedent.md` | Before adding a new pattern — surface existing related decisions. |
| `check-diff-before-commit.md` | Run shift-left enforcement against working-tree diff. |
| `bulk-import-existing-docs.md` | Import an existing `docs/` folder of architectural notes. |
| `promote-or-dismiss-drafts.md` | Walk the proposals queue and triage each. |
| `cross-project-recall.md` | Search across all accessible projects when scoped search is empty. |
| `enforce-on-PR.md` | Set up GitHub Action for CI-time decision enforcement. |

## How to use

### Claude Code (plugin already installed)

Skills auto-discovered alongside the plugin's slash commands. Invoke
naturally — `/valis-capture`, `/valis-find`, etc.

### claude.ai web

1. Open the SKILL.md you want.
2. Copy its full contents (including frontmatter).
3. In claude.ai chat, type `/skill-creator`.
4. Paste contents and follow prompts. Skill is added to your workspace.
5. Now available in `/` picker as `/<skill-name>`.

### Cursor / Codex / Aider / Gemini CLI / Goose / OpenCode

Drop the SKILL.md files into the harness's skill directory (location
varies — see your harness docs). Each runtime auto-discovers AAIF skills.

## Tools required

All skills assume the Valis MCP server is connected. Tools used:
- `valis_search`, `valis_context` — read
- `valis_store`, `valis_lifecycle` — write
- `valis_check_diff` — CI shift-left

If MCP is not connected, skills will fail with "tool not found". Connect
Valis as a custom connector (claude.ai web) or install the plugin
(Claude Code) first.
