#!/usr/bin/env node
"use strict";

/**
 * Valis PostToolUse hook — periodic capture reminder.
 * Every 5th tool call, reminds the agent to search/store team decisions.
 * Pure Node.js, zero dependencies.
 */

// Drain stdin (hook protocol)
process.stdin.resume();
process.stdin.on("data", () => {});
process.stdin.on("end", run);
process.stdin.on("error", () => process.exit(0));

function run() {
  try {
    const fs = require("fs");
    const path = require("path");

    const dataDir = process.env.CLAUDE_PLUGIN_DATA;
    if (!dataDir) process.exit(0);

    const statePath = path.join(dataDir, "capture-state.json");

    // Read current count
    let count = 0;
    try {
      const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
      if (typeof state.count === "number" && Number.isFinite(state.count)) {
        count = state.count;
      }
    } catch {
      // File missing or corrupt — start from 0
    }

    count = (count % 1_000_000) + 1;

    // Write back
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch { /* already exists */ }
    fs.writeFileSync(statePath, JSON.stringify({ count }), "utf8");

    // Every 5th call — emit reminder
    if (count % 5 === 0) {
      try {
        process.stdout.write(JSON.stringify({
          additionalContext:
            "Valis reminder: search valis_search before decisions, store each via valis_store (one per call, include summary + affects).",
        }) + "\n");
      } catch { /* ignore */ }
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
}
