#!/usr/bin/env node
"use strict";

/**
 * Stop hook (plugin path).
 *
 * Phase A: silent-skip stub. Delegates to the CLI's silent-skip stub.
 * Activates only if Phase B FR-042 telemetry triggers (Stop knowledge sweep).
 */

const { delegate } = require("./lib/delegate.js");
delegate("stop");
