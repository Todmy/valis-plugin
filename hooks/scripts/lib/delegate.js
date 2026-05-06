"use strict";

/**
 * Plugin → CLI delegation helper.
 *
 * Per feature 023 v2 / R-05 + R-09 + BUG #119:
 *
 * - Plugin scripts MUST NOT spawn shells. Use spawnSync's argv-array form
 *   (`spawnSync('valis', [...args])`) so the user's PATH-injected `valis`
 *   binary runs without shell interpolation.
 *
 * - When the user-side CLI hook is registered in ~/.claude/settings.json
 *   (substring match `valis hook`), the plugin script silently exits 0.
 *   The user-side hook is canonical. Avoids double-injection.
 *
 * - On delegation, we inherit stdio so the CLI's stdout/stderr are the
 *   plugin's stdout/stderr — the agent receives the labeled block exactly
 *   as if the CLI had been invoked directly.
 *
 * Pure Node.js, zero npm dependencies. Targets Node 20+.
 */

const { spawnSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { homedir } = require("node:os");

function userSideHookRegistered() {
  try {
    const settingsPath = join(homedir(), ".claude", "settings.json");
    const data = readFileSync(settingsPath, "utf-8");
    return data.includes("valis hook");
  } catch {
    return false;
  }
}

/**
 * Delegate to `valis hook <event>` via spawnSync argv-array form.
 * Exits with the child's exit code. Errors → silent exit 0
 * (Constitution III: hooks must never block the session).
 */
function delegate(event) {
  if (userSideHookRegistered()) {
    process.exit(0);
  }

  const result = spawnSync("valis", ["hook", event], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    // ENOENT → CLI not installed; silent skip is the right answer.
    process.exit(0);
  }

  process.exit(result.status === null ? 0 : result.status);
}

module.exports = { delegate, userSideHookRegistered };
