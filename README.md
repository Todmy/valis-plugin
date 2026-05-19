# Valis — Decision Intelligence for Dev Teams

Capture, search, and enforce architectural decisions across AI coding sessions. One shared memory across Claude, Perplexity, Gemini, Cursor — install once, every agent sees the same decisions.

## Install — three paths

### A. Let your agent install it for you (recommended for Claude Code)

Paste this into Claude Code:

> Install Valis in this project. Read https://github.com/Todmy/valis-plugin/blob/main/README.md and run every step — both the CLI install (via your Bash tool) and the plugin install (via your SlashCommand tool) — then run `/valis:init` for me.

The agent will:
1. Run `npm install -g valis-cli` via its Bash tool
2. Run the two `/plugin` commands via its SlashCommand tool
3. Run `/valis:init` so you finish on the project picker

For **Cursor / Codex / Gemini CLI** — those harnesses don't have the `/plugin` system. Use path C below, or paste:

> Install Valis CLI globally: `npm install -g valis-cli`, then run `valis init` for me.

Why both pieces (CLI + plugin) are needed: the **plugin** ships slash commands + remote MCP wiring; the **CLI** ships the local hook subprocesses (`valis hook session-start`, `valis hook pre-compact`, …) that the plugin's hook scripts delegate to. Installing only the plugin gives you the slash commands but disables the hook surface (capture reminder, pre-compact capture gate, self-heal).

### B. Manual — three commands

```bash
# 1. CLI (provides the hook binaries the plugin delegates to)
npm install -g valis-cli
```

```text
# 2. Plugin (in Claude Code)
/plugin marketplace add Todmy/valis-plugin
/plugin install valis@valis-plugin
/valis:init
```

OAuth login happens automatically on first MCP call.

### C. Other agents (Cursor / Codex / Gemini CLI / OpenCode)

```bash
npm install -g valis-cli
valis init               # writes the stdio MCP config for your IDE
```

`valis init` auto-detects the installed harness and writes the right config file. Restart the agent — `valis_*` tools appear in its tool list.

## What it does

Valis keeps your team's architectural decisions, constraints, and patterns in a shared knowledge base. The AI agent checks this knowledge before making decisions and stores new ones after. Same memory works across Claude Code, Perplexity, Gemini CLI, Cursor, Codex — one decision recorded in any agent is visible in all the others.

- **SessionStart hook** — runs local self-heal so the install stays healthy across plugin/CLI version drift
- **UserPromptSubmit hook** — token-density-scheduled capture reminder; periodically nudges the agent to store decisions made in the last few turns
- **PreCompact hook** — capture gate: blocks `/compact` until the agent has stored conversation decisions, then auto-resumes (v0.5.2+)
- **10 slash commands** — guided workflows for common operations

## Commands

| Command | What it does |
|---------|-------------|
| `/valis:init` | Connect this repo to a Valis project (creates `.valis.json`) |
| `/valis:status` | Show connection, auth, project info |
| `/valis:store` | Store a decision with guided classification |
| `/valis:search` | Search team knowledge base |
| `/valis:before-task` | Load relevant context before starting work |
| `/valis:check` | Run the team's enforcement check against your working-tree diff before committing |
| `/valis:extract` | Extract decisions from a folder of documents |
| `/valis:add-command` | Create a KB-backed persona command |
| `/valis:lifecycle` | Promote, deprecate, or supersede decisions |

## Cross-harness skills (claude.ai web, Cursor, Codex, Gemini CLI, Goose, OpenCode)

The slash commands above are Claude Code-specific. For other harnesses,
the same workflows ship as AAIF SKILL.md files in `skills/valis/`. They
work in any runtime that honors the AAIF spec — including claude.ai web
via the `/skill-creator` flow.

| Skill | Purpose |
|---|---|
| `valis-capture` | Dedup-check + store an architectural decision |
| `valis-find` | Surface existing precedent before adding a new pattern |
| `valis-check` | Shift-left enforcement against working-tree diff |
| `valis-import` | Bulk-import a folder of architectural notes |
| `valis-triage` | Walk the proposals queue; promote or dismiss |
| `valis-recall` | Search across all accessible projects (catches silent miss) |
| `valis-ci` | Set up GitHub Actions for PR-time enforcement |

See `skills/valis/README.md` for setup per harness.

## Setup

> Both flows assume `npm install -g valis-cli` is already done (or that you used path A above and let the agent install it). Without the CLI the slash commands still work, but hooks (capture reminder, pre-compact gate, self-heal) are no-ops.

### New project (owner)

```text
/plugin marketplace add Todmy/valis-plugin
/plugin install valis@valis-plugin
/valis:init                  # pick or create your project
```

Then in your shell:

```bash
git add .valis.json && git commit -m "add valis config"
```

### Existing project (team member)

```bash
git clone <repo>             # .valis.json already in repo
npm install -g valis-cli     # if you haven't already
```

```text
/plugin marketplace add Todmy/valis-plugin
/plugin install valis@valis-plugin   # OAuth on first use
```

Team decisions load automatically.

### Updating an existing install

Claude Code marketplaces do **not** auto-pull from upstream. To get newer plugin features (delegator pattern, new hooks, slash commands), update the marketplace clone explicitly:

```
/plugin marketplace update valis-plugin
```

If the slash command is unavailable in your CC version, fall back to git:

```bash
git -C ~/.claude/plugins/marketplaces/valis-plugin pull --ff-only origin main
rsync -a --exclude='.git' \
  ~/.claude/plugins/marketplaces/valis-plugin/ \
  ~/.claude/plugins/cache/valis-plugin/valis/0.1.0/
```

The cache copy is what Claude Code executes at runtime; both must be in sync. Restart Claude Code after updating.

**Why this matters**: feature releases that depend on plugin commits (e.g., self-heal in CLI 0.2.0 requires the plugin's delegator from commit `1379f95`+) will silently no-op for users on stale installs. If you upgrade `valis-cli` but skip the plugin update, you get partial functionality.

## How it works

- **Remote MCP server** at `valis.krukit.co/api/mcp` — slash commands + MCP tools run through HTTP, no CLI needed for those
- **Local CLI** (`valis-cli` on npm) — provides the hook subprocesses that the plugin's hook scripts delegate to. Without it, slash commands work but hooks no-op
- **OAuth 2.1** authentication — browser login, tokens in OS keychain
- **`.valis.json`** in repo root — scopes operations to your project, shared via git
- **3 active hooks** — SessionStart (self-heal), UserPromptSubmit (capture reminder), PreCompact (capture gate v0.5.2+). Three more subscribed as silent stubs (PreToolUse, PostToolUse, Stop) so future features ship without a plugin update.

## Configuration

Override defaults via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `VALIS_API_URL` | `https://valis.krukit.co` | API base URL (for self-hosted) |
| `VALIS_NUDGE_INTERVAL` | `5` | Tool calls between nudges |
| `VALIS_API_TIMEOUT` | `5000` | API timeout in ms |
| `VALIS_EXTRA_EXTENSIONS` | _(empty)_ | Extra file extensions for `/valis:extract` |
| `VALIS_BYTES_PER_TOKEN` | `4` | Token estimation ratio |

## Links

- [Valis Dashboard](https://valis.krukit.co)
- [Report an issue](https://github.com/Todmy/valis-plugin/issues)

## License

Proprietary — source available for audit under the [Valis Plugin EULA](./LICENSE).

This plugin is a thin client for the hosted Valis service at [valis.krukit.co](https://valis.krukit.co). Installation and use require a valid Valis account. See the [LICENSE](./LICENSE) file for full terms.
