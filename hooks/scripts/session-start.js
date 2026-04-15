#!/usr/bin/env node
"use strict";

/**
 * Valis SessionStart hook
 *
 * Reads .valis.json to find the project_id, fetches team context from
 * the Valis API, and injects it as additionalContext.
 * Pure Node.js — zero external dependencies.
 */

const { API_BASE_URL, TIMEOUTS, loadConfig, writeOutput } = require("./lib/config.js");

// Drain stdin (hook protocol)
process.stdin.resume();
process.stdin.on("data", () => {});
process.stdin.on("end", main);
process.stdin.on("error", () => process.exit(0));

async function main() {
  try {
    const config = loadConfig();
    if (!config) process.exit(0);

    const { project_id } = config;
    if (!project_id) process.exit(0);

    // Fetch session context with configurable timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUTS.api);

    let response;
    try {
      response = await fetch(
        `${API_BASE_URL}/api/session-context?project_id=${encodeURIComponent(project_id)}`,
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
