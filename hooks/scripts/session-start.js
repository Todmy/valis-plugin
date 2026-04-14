#!/usr/bin/env node
"use strict";

/**
 * Valis SessionStart hook
 *
 * Loads team decision context from the Valis API at session start.
 * Reads .valis.json from the project directory to determine project_id,
 * then fetches relevant context and injects it as additionalContext.
 *
 * Pure Node.js — zero external dependencies.
 */

// Drain stdin first (hook protocol sends JSON context via stdin)
process.stdin.resume();
process.stdin.on("data", () => {});
process.stdin.on("end", main);
process.stdin.on("error", () => process.exit(0));

async function main() {
  try {
    // 1. Locate and read .valis.json
    const fs = require("fs");
    const path = require("path");

    const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    const configPath = path.join(projectDir, ".valis.json");

    let config;
    try {
      const raw = fs.readFileSync(configPath, "utf8");
      config = JSON.parse(raw);
    } catch {
      // No .valis.json or invalid JSON — exit silently
      process.exit(0);
    }

    const { project_id } = config;
    if (!project_id) {
      process.exit(0);
    }

    // 2. Fetch session context from Valis API
    const url = `https://valis.krukit.co/api/session-context?project_id=${encodeURIComponent(project_id)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let response;
    try {
      response = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" },
        signal: controller.signal,
      });
    } catch {
      // Network error or timeout — exit silently
      process.exit(0);
    } finally {
      clearTimeout(timeout);
    }

    // 3. Handle response
    if (response.status === 401) {
      writeOutput({
        additionalContext:
          "Valis plugin installed but not connected. Use the authenticate tool to connect your team knowledge base.",
      });
      return;
    }

    if (!response.ok) {
      // Non-200, non-401 — exit silently
      process.exit(0);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      process.exit(0);
    }

    const contextText = data && data.context_text;
    if (!contextText) {
      process.exit(0);
    }

    writeOutput({
      additionalContext: `=== VALIS TEAM DECISIONS (read-only context) ===\n${contextText}\n=== END VALIS CONTEXT ===`,
    });
  } catch {
    // Catch-all: never crash
    process.exit(0);
  }
}

function writeOutput(obj) {
  try {
    process.stdout.write(JSON.stringify(obj) + "\n");
  } catch {
    // ignore write errors
  }
}
