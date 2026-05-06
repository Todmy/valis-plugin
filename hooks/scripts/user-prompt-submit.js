#!/usr/bin/env node
"use strict";

/**
 * UserPromptSubmit hook (plugin path) — Phase A US2 always-inject.
 * Delegates to `valis hook user-prompt-submit` via argv-array spawnSync.
 */

const { delegate } = require("./lib/delegate.js");
delegate("user-prompt-submit");
