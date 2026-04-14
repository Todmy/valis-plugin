#!/usr/bin/env node
"use strict";

/**
 * Valis PostToolUse hook — periodic capture reminder
 *
 * Maintains a counter in CLAUDE_PLUGIN_DATA/capture-state.json.
 * Every 5th tool invocation, injects a gentle reminder to search/store
 * team decisions via Valis.
 *
 * Pure Node.js — zero external dependencies.
 * Non-firing calls complete in <5ms (no async, no I/O beyond a tiny JSON file).
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
    if (!dataDir) {
      process.exit(0);
    }

    const statePath = path.join(dataDir, "capture-state.json");

    // Read current count
    let count = 0;
    try {
      const raw = fs.readFileSync(statePath, "utf8");
      const state = JSON.parse(raw);
      if (typeof state.count === "number" && Number.isFinite(state.count)) {
        count = state.count;
      }
    } catch {
      // File missing or corrupt — start from 0
    }

    // Increment
    count += 1;

    // Write back (ensure directory exists)
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      // directory likely already exists
    }
    fs.writeFileSync(statePath, JSON.stringify({ count }), "utf8");

    // Every 5th call — emit reminder
    if (count % 5 === 0) {
      const msg = {
        additionalContext:
          "Valis periodic check: Before making architectural or technical decisions \u2014 call valis_search to check existing team knowledge. After decisions are made \u2014 store each one separately via valis_store (one decision per call, never batch multiple decisions into one store call). Types: decision, constraint, pattern, lesson. Always include summary (max 100 chars) and affects.",
      };
      try {
        process.stdout.write(JSON.stringify(msg) + "\n");
      } catch {
        // ignore
      }
    }

    process.exit(0);
  } catch {
    // Catch-all: never crash
    process.exit(0);
  }
}
