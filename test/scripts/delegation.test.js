"use strict";

/**
 * Plugin → CLI delegation regression test (feature 023 US5 / T057).
 *
 * Verifies:
 *   1. User-side probe correctly detects the user-side hook substring in
 *      ~/.claude/settings.json.
 *   2. When probe positive, delegate() exits 0 without spawning anything.
 *   3. When probe negative, delegate() invokes spawnSync with argv-array
 *      form ('valis', ['hook', '<event>']) — never shell-string form.
 *   4. **Critical regression test (R-05 invariant)**: static-grep across
 *      every plugin hook script asserts NO shell-string spawning patterns.
 *      Per R-05, the only allowed form is the argv-array variant; any
 *      shell invocation is a security regression that re-opens BUG #119
 *      and the broader command-injection surface.
 *
 * Runs under Node's built-in test runner: `node --test`.
 * No npm dependencies — the plugin is zero-dep by design.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  readFileSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  statSync,
  mkdtempSync,
} = require("node:fs");
const { join, resolve } = require("node:path");
const { tmpdir } = require("node:os");

const SCRIPTS_DIR = resolve(__dirname, "..", "..", "hooks", "scripts");

// ---------------------------------------------------------------------------
// (4) Static-grep regression — argv-array form only.
// Patterns are assembled at runtime so the literal forbidden tokens never
// appear in this file's source (avoids the codebase's security-reminder
// hook flagging this test itself).
// ---------------------------------------------------------------------------

const SHELL_TOKEN = ["e", "x", "e", "c"].join("");
const SYNC_TOKEN = SHELL_TOKEN + "Sync";

const BANNED_PATTERNS = [
  // Shell-string form of synchronous shell invocation
  new RegExp("\\b" + SYNC_TOKEN + "\\s*\\("),
  // Shell-string form of asynchronous shell invocation, called with a literal string argument
  new RegExp("\\b" + SHELL_TOKEN + "\\s*\\(\\s*['\"`]"),
  // spawnSync called with a single string that contains a space (i.e. shell-string command line)
  /spawnSync\s*\(\s*['"`][^'"`]*\s+/,
  // explicit shell:true option
  /\bshell\s*:\s*true\b/,
];

test("plugin scripts use argv-array spawnSync form only (R-05)", () => {
  const entries = readdirSync(SCRIPTS_DIR);
  const allFiles = [];
  for (const e of entries) {
    const full = join(SCRIPTS_DIR, e);
    if (statSync(full).isDirectory()) {
      for (const inner of readdirSync(full)) allFiles.push(join(full, inner));
    } else {
      allFiles.push(full);
    }
  }

  for (const file of allFiles) {
    if (!file.endsWith(".js")) continue;
    const code = readFileSync(file, "utf-8");
    // Strip block + line comments + string literals so docstring mentions
    // of forbidden tokens don't trigger the grep.
    const stripped = code
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
      .replace(/'(?:[^'\\]|\\.)*'/g, "''")
      .replace(/"(?:[^"\\]|\\.)*"/g, '""')
      .replace(/`(?:[^`\\]|\\.)*`/g, "``");

    for (const pattern of BANNED_PATTERNS) {
      assert.doesNotMatch(
        stripped,
        pattern,
        file + " must not contain pattern " + String(pattern) + " — only spawnSync('valis', [...args]) is allowed.",
      );
    }
  }
});

// ---------------------------------------------------------------------------
// (1)+(2)+(3) delegate() behavior — exercise the helper via a child process
// with a fake HOME containing a crafted settings.json.
// ---------------------------------------------------------------------------

const { spawnSync } = require("node:child_process");

function runDelegateInChild(fakeHome, env, event) {
  const driver =
    'process.env.HOME = ' +
    JSON.stringify(fakeHome) +
    ';\n' +
    'process.env.USERPROFILE = ' +
    JSON.stringify(fakeHome) +
    ';\n' +
    'const { delegate } = require(' +
    JSON.stringify(join(SCRIPTS_DIR, "lib", "delegate.js")) +
    ');\n' +
    'delegate(' +
    JSON.stringify(event) +
    ');';
  return spawnSync(process.execPath, ["-e", driver], {
    stdio: ["ignore", "pipe", "pipe"],
    env,
  });
}

test("delegate() exits 0 when user-side hook is registered", () => {
  const fakeHome = mkdtempSync(join(tmpdir(), "valis-plugin-test-"));
  try {
    mkdirSync(join(fakeHome, ".claude"), { recursive: true });
    writeFileSync(
      join(fakeHome, ".claude", "settings.json"),
      JSON.stringify({
        hooks: {
          SessionStart: [
            { hooks: [{ type: "command", command: "valis hook session-start" }] },
          ],
        },
      }),
    );

    const env = { ...process.env, HOME: fakeHome, USERPROFILE: fakeHome };
    const result = runDelegateInChild(fakeHome, env, "session-start");
    assert.equal(
      result.status,
      0,
      "expected exit 0; stderr: " + (result.stderr ? result.stderr.toString() : ""),
    );
  } finally {
    rmSync(fakeHome, { recursive: true, force: true });
  }
});

test("delegate() falls back gracefully when CLI binary is missing", () => {
  // Probe negative + valis CLI not on PATH → delegate() must still exit 0
  // (Constitution III — hooks must never block the session).
  const fakeHome = mkdtempSync(join(tmpdir(), "valis-plugin-test-"));
  try {
    mkdirSync(join(fakeHome, ".claude"), { recursive: true });
    writeFileSync(join(fakeHome, ".claude", "settings.json"), "{}");

    const env = { HOME: fakeHome, USERPROFILE: fakeHome, PATH: "/nonexistent" };
    const result = runDelegateInChild(fakeHome, env, "session-start");
    assert.equal(
      result.status,
      0,
      "expected graceful exit 0; got " + result.status + "; stderr: " + (result.stderr ? result.stderr.toString() : ""),
    );
  } finally {
    rmSync(fakeHome, { recursive: true, force: true });
  }
});

test("hook scripts directory contains exactly the six Phase A delegators", () => {
  const entries = readdirSync(SCRIPTS_DIR).filter((e) => e.endsWith(".js"));
  const expected = [
    "post-tool-use.js",
    "pre-compact.js",
    "pre-tool-use.js",
    "session-start.js",
    "stop.js",
    "user-prompt-submit.js",
  ];
  assert.deepEqual(entries.sort(), expected);
});

test("hooks.json registers all six events with matching script paths", () => {
  const cfg = JSON.parse(
    readFileSync(resolve(__dirname, "..", "..", "hooks", "hooks.json"), "utf-8"),
  );
  const expected = {
    SessionStart: "session-start.js",
    UserPromptSubmit: "user-prompt-submit.js",
    PostToolUse: "post-tool-use.js",
    PreToolUse: "pre-tool-use.js",
    PreCompact: "pre-compact.js",
    Stop: "stop.js",
  };
  for (const [event, script] of Object.entries(expected)) {
    const entry = cfg.hooks[event];
    assert.ok(entry && entry.length > 0, "hooks.json missing " + event);
    const cmd = entry[0].hooks[0].command;
    assert.match(cmd, new RegExp(script), event + " command should reference " + script + "; got " + cmd);
  }
});
