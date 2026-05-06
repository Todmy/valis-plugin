#!/usr/bin/env node
"use strict";

/**
 * PreToolUse hook (plugin path).
 *
 * Phase A: silent-skip stub. Delegates to the CLI's silent-skip stub.
 * Activates only if Phase B FR-040 telemetry triggers (grep-anchored
 * pre-edit guard).
 */

const { delegate } = require("./lib/delegate.js");
delegate("pre-tool-use");
