#!/usr/bin/env node
"use strict";

/**
 * Valis PreCompact hook — save-before-compaction reminder
 *
 * Fires before Claude Code compacts the conversation context.
 * Injects a prompt telling the agent to store any unstored decisions
 * before context is lost.
 *
 * Pure Node.js — zero external dependencies.
 */

const { writeOutput } = require("./lib/config.js");

// Drain stdin (hook protocol)
process.stdin.resume();
process.stdin.on("data", () => {});
process.stdin.on("end", run);
process.stdin.on("error", () => process.exit(0));

function run() {
  try {
    writeOutput({
      additionalContext:
        "Context is about to be compacted. Before compaction completes, review this session for any architectural decisions, constraints, patterns, or lessons that have not yet been stored to Valis. Store each one now via valis_store — after compaction this context will be lost.",
    });
    process.exit(0);
  } catch {
    process.exit(0);
  }
}
