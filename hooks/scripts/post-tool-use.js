#!/usr/bin/env node
"use strict";

/**
 * PostToolUse hook (plugin path).
 *
 * Phase A: silent-skip stub. Plugin subscribes to this event proactively
 * so future activation of capture-on-tool-edit logic (e.g., extract
 * decisions after a Write/Edit) ships as a CLI-only change without a
 * plugin redeploy.
 *
 * Currently delegates to `valis hook post-tool-use`, which is itself a
 * stub in the CLI (silent exit 0). The subscription was originally
 * dropped after BACKLOG #172 removed cache infrastructure; re-added here
 * purely as a future-proofing channel.
 */

const { delegate } = require("./lib/delegate.js");
delegate("post-tool-use");
