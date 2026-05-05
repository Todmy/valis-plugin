---
name: valis-ci
description: Set up GitHub Actions for CI-time decision enforcement. Mirror of the in-session check, but runs on every PR — block merges when high-severity violations are detected.
---

# Enforce decisions on PRs

Use when the user wants their team's decisions enforced at PR time,
not just shift-left. Common in teams that want hard gates, or projects
with external contributors who don't run in-session checks.

## Procedure

1. **Check current state**:
   - Is `.github/workflows/valis.yml` (or similar) already present?
   - Is the `todmy/valis-action` listed in any workflow?

   Skip ahead if already configured — direct user to verify it's
   running on recent PRs.

2. **Generate a project-scoped token** so the Action can authenticate
   without exposing user-level credentials:
   - Direct user to dashboard → project settings → "Generate CI token"
   - Token format: `tmp_*` (project-scoped, can only read decisions
     for this project + write violation events)

3. **Add to repo secrets**:
   - GitHub repo → Settings → Secrets and variables → Actions
   - Name: `VALIS_CI_TOKEN`
   - Value: the `tmp_*` token from step 2

4. **Create the workflow file** at `.github/workflows/valis-check.yml`:
   ```yaml
   name: Valis decision check
   on:
     pull_request:
       types: [opened, synchronize, reopened]
   jobs:
     check:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
           with:
             fetch-depth: 0
         - uses: todmy/valis-action@v1
           with:
             token: ${{ secrets.VALIS_CI_TOKEN }}
   ```

5. **Configure enforcement mode** in dashboard project settings:
   - `block` — high-severity violations fail the PR check (recommended
     for tight teams)
   - `suggest` — violations posted as PR comment but don't fail check
     (recommended for permissive culture or first weeks of rollout)

6. **Test on a draft PR** — push a deliberately violating change, verify
   the Action runs and posts violations as expected.

7. **Document for the team** — add a brief note to the repo's
   CONTRIBUTING.md or README so contributors know what the bot is and
   how to handle violations (acknowledge with `[valis-ack: <id>]` in
   commit message, or fix the diff).

## Don't

- Don't expose the `VALIS_CI_TOKEN` outside repo secrets — it has
  project-scoped write access.
- Don't enable `block` mode on day 1 without dogfooding `suggest` mode
  for at least a week. Block-without-history breeds resentment.
- Don't skip step 6 (test on draft PR) — silent CI failures defeat the
  whole point.

## Why this matters

In-session checks (`valis-check` skill) are voluntary — depend on the
contributor remembering to run them. PR checks are mandatory — every
PR is gated. Together they form the shift-left + shift-right pair: fix
violations early, catch missed ones late.

Without PR enforcement, decisions slowly become advisory and the team
brain shifts from "rules" to "suggestions" — usually within 6 months.
