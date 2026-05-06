#!/usr/bin/env node
"use strict";

/**
 * SessionStart hook (plugin path).
 *
 * Phase A delegator — see lib/delegate.js for full rationale.
 * If user-side `valis hook` is registered, exit 0; otherwise delegate
 * to the CLI via spawnSync argv-array form.
 */

const { delegate } = require("./lib/delegate.js");
delegate("session-start");
