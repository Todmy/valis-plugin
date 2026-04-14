#!/usr/bin/env node
"use strict";

/**
 * Valis SessionStart hook
 *
 * Reads .valis.json to find the project_id, fetches team context from
 * the Valis API, and injects it as additionalContext.
 * Pure Node.js — zero external dependencies.
 */

// Drain stdin (hook protocol)
process.stdin.resume();
process.stdin.on("data", () => {});
process.stdin.on("end", main);
process.stdin.on("error", () => process.exit(0));

async function main() {
  try {
    const fs = require("fs");
    const path = require("path");

    const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    const configPath = path.join(projectDir, ".valis.json");

    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch {
      process.exit(0);
    }

    const { project_id } = config;
    if (!project_id) process.exit(0);

    // Fetch session context with 5s timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let response;
    try {
      response = await fetch(
        `https://valis.krukit.co/api/session-context?project_id=${encodeURIComponent(project_id)}`,
        { headers: { Accept: "application/json" }, signal: controller.signal }
      );
    } catch {
      process.exit(0);
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 401) {
      writeOutput({
        additionalContext:
          "Valis plugin installed but not connected. Use the authenticate tool to connect your team knowledge base.",
      });
      return;
    }

    if (!response.ok) process.exit(0);

    let data;
    try {
      data = await response.json();
    } catch {
      process.exit(0);
    }

    const contextText = data && data.context_text;
    if (!contextText) process.exit(0);

    // Truncate oversized responses to protect context window
    const MAX_LENGTH = 256 * 1024;
    const text = contextText.length > MAX_LENGTH
      ? contextText.slice(0, MAX_LENGTH) + "\n[... truncated at 256 KB]"
      : contextText;

    writeOutput({
      additionalContext: `=== VALIS TEAM DECISIONS (read-only context) ===\n${text}\n=== END VALIS CONTEXT ===`,
    });
  } catch {
    process.exit(0);
  }
}

function writeOutput(obj) {
  try {
    process.stdout.write(JSON.stringify(obj) + "\n");
  } catch { /* ignore */ }
}
