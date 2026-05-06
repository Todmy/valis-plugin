#!/usr/bin/env node
"use strict";

/**
 * PostToolUse hook (plugin path) — Phase A own-write cache invalidation.
 * Delegates to `valis hook post-tool-use` via argv-array spawnSync.
 */

const { delegate } = require("./lib/delegate.js");
delegate("post-tool-use");
