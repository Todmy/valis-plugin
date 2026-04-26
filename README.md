# Valis — Decision Intelligence for Dev Teams

Capture, search, and enforce architectural decisions across AI coding sessions.

```
/plugin install valis
```

That's it. OAuth login happens automatically on first use.

## What it does

Valis keeps your team's architectural decisions, constraints, and patterns in a shared knowledge base. The AI agent checks this knowledge before making decisions and stores new ones after.

- **SessionStart hook** — loads recent team decisions into every session
- **Periodic nudge** — reminds the agent to search before deciding, store after deciding
- **8 slash commands** — guided workflows for common operations

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

## Setup

### New project (owner)

```
/plugin install valis        # install plugin
/valis:init                  # pick your project
git add .valis.json && git commit -m "add valis config"
```

### Existing project (team member)

```
git clone <repo>             # .valis.json already in repo
/plugin install valis        # install plugin, OAuth on first use
```

Done. Team decisions load automatically.

## How it works

- **Remote MCP server** at `valis.krukit.co/api/mcp` — no CLI installation needed
- **OAuth 2.1** authentication — browser login, tokens in OS keychain
- **`.valis.json`** in repo root — scopes operations to your project, shared via git
- **3 hooks** — SessionStart (context), PostToolUse (periodic nudge), PreCompact (save before compaction)

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
