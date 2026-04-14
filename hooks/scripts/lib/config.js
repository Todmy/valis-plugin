#!/usr/bin/env node
"use strict";

/**
 * Shared configuration and utilities for Valis hook scripts.
 *
 * All tunables live here so hooks stay focused on behavior.
 * Override via environment variables (VALIS_*) or .valis.json fields.
 *
 * Pure Node.js — zero external dependencies.
 */

const fs = require("fs");
const path = require("path");

// ─── Configuration ───────────────────────────────────────────────────────────

/**
 * Base URL for the Valis API.
 * Override: VALIS_API_URL env var, or "api_url" field in .valis.json.
 */
const API_BASE_URL =
  process.env.VALIS_API_URL || "https://valis.krukit.co";

/**
 * How often (every N tool invocations) the capture reminder fires.
 * Override: VALIS_NUDGE_INTERVAL env var.
 */
const NUDGE_INTERVAL = parseInt(process.env.VALIS_NUDGE_INTERVAL, 10) || 5;

/**
 * Timeout values in milliseconds.
 * Override: VALIS_API_TIMEOUT env var (applies to api timeout).
 */
const TIMEOUTS = Object.freeze({
  api: parseInt(process.env.VALIS_API_TIMEOUT, 10) || 5000,
});

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Load and parse .valis.json from the project directory.
 * Returns the parsed config object, or null if not found / invalid.
 * If config contains api_url, it will be picked up by the caller via
 * the exported API_BASE_URL (env var takes precedence over file).
 */
function loadConfig() {
  try {
    const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    const configPath = path.join(projectDir, ".valis.json");
    const raw = fs.readFileSync(configPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Write a JSON object to stdout following the Claude hook protocol.
 * Silently ignores write errors (pipe may be closed).
 */
function writeOutput(obj) {
  try {
    process.stdout.write(JSON.stringify(obj) + "\n");
  } catch {
    // ignore write errors
  }
}

module.exports = {
  API_BASE_URL,
  NUDGE_INTERVAL,
  TIMEOUTS,
  loadConfig,
  writeOutput,
};
