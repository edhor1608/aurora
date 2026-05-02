# Repo Refresh Audit (2026-05-01)

## Context

Aurora was generated mostly by AI and now needs to become a durable project that future coding agents can clone, run, test, and extend without hidden local state. The desired direction is not more scaffolding. The repo needs a boring, reliable developer loop, real tests, useful docs, and guardrails that make bad generated code harder to land.

This audit reviewed tracked markdown, TypeScript code, configs, tests, local workflow state, and current external context for Discord-like open/community platforms.

## Current Verdict

Aurora is a good seed, but it is still a scaffold with one real vertical slice. The repo is healthier than typical AI-generated output because it has strict TypeScript, Bun/Turbo scripts, Convex auth wiring, and passing tests. The weak point is that the tests and docs overstate readiness. A future agent can run the green suite, but that does not prove the app is fresh-clone usable or product-shaped.

The next cleanup should focus on making the existing slice honest and reproducible before adding features.

## What Works

- `bun run test` passes locally: 12 files, 36 tests.
- `bun run test:e2e:browser` passes locally: 2 Playwright tests.
- The root package uses Bun workspaces and Turbo consistently.
- TypeScript is strict across the main packages.
- The web app has a real Better Auth + Convex + TanStack Start message flow.
- Convex schema and functions model the intended `community -> channel -> thread -> message` hierarchy.
- `packages/core` has useful deterministic tests for permissions and text flow.
- The docs capture important product constraints: EU-first operation, AGPL, public API parity, Docker Compose self-host v1, and LiveKit EU.

## Main Problems To Clean Up

### P0: Fresh-clone runtime is not reproducible enough

The browser e2e flow passes on this machine, but it depends on `.env.local` and a configured Convex deployment. That means a new agent cannot reliably clone the repo and run the complete product test without extra undocumented setup.

Required cleanup:

- Add `.env.example` with all required variables and safe placeholder values.
- Document the exact bootstrap path from zero: `bun install`, Convex setup, env setup, generated types, web dev server, tests.
- Add a local/disposable backend test path. Prefer one of:
  - documented `bunx convex dev --once` with a clearly expected cloud/dev deployment flow, or
  - self-hosted Convex dev setup if the project wants true offline/fresh-clone reproducibility.
- Add a single command for the agent loop, for example `bun run verify`, that runs typecheck, lint, unit/integration tests, and the browser e2e when env is available.
- Split browser e2e into `test:e2e:browser` and a documented `test:e2e:browser:local` or `test:e2e:browser:cloud` if they need different env assumptions.

Why this matters: future agents will trust commands. If the complete product path requires hidden local secrets or an existing remote deployment, agents will produce false confidence.

### P0: Docs are stale and misleading

Some docs are useful, but several are still generated starter text.

Problems:

- `convex/README.md` is still the stock Convex template and tells users to use the starter CLI command, which conflicts with the repo's Bun workflow.
- `apps/web/README.md` still describes a starter and uses `bun --bun run`, while root scripts use normal `bun run`.
- `apps/mobile/App.tsx` still renders Expo starter copy.
- `README.md` says the web and mobile apps are starters, while elsewhere it claims a real vertical slice.
- There is no agent-focused `AGENTS.md` committed in the repo, even though this project explicitly wants agentic coding.

Required cleanup:

- Replace `convex/README.md` with Aurora-specific backend setup, env, schema, auth, and regeneration notes.
- Replace `apps/web/README.md` with real web app setup and troubleshooting.
- Add root `AGENTS.md` with repo rules: Bun only, no `any`, no broad refactors, Graphite-first workflow, fresh-clone commands, testing expectations, docs expectations.
- Add `docs/development.md` or `docs/agent-runbook.md` with the exact agent workflow.
- Either remove mobile from the claimed foundation or replace the starter screen with a minimal Aurora shell.

### P1: Test suite has useful pieces but too many structural/assertion tests

Useful tests:

- `tests/integration/text-flow.integration.test.ts` tests real core behavior: community, membership, channel, permission override, session expiry, message send/list.
- `tests/unit/auth-session.test.ts` exercises Better Auth-backed session issuance.
- `tests/unit/core-permissions.test.ts` is small and meaningful.
- `tests/e2e/playwright/auth-and-message.spec.ts` exercises the real browser auth/message path.

Weak tests:

- `tests/integration/web-tanstack-start-auth.integration.test.ts` mostly checks that source files contain certain strings. This catches wiring drift, but it is brittle and not strong behavior coverage.
- `tests/integration/env-handling.integration.test.ts` checks source text instead of runtime behavior.
- `tests/integration/convex-auth-docs.integration.test.ts` checks imports/string usage more than behavior.
- `tests/snapshot/docs.snapshot.test.ts` snapshots docs, which can block legitimate wording changes without proving product correctness.
- `tests/e2e/baseline-checks.e2e.test.ts` shells out to run typecheck/lint/test commands inside Vitest. This is slow, nested, and better as a CI job or `verify` script than as a test.
- Several workspace packages use `vitest run --passWithNoTests`, which creates green package tests without actual package-level coverage.
- Smoke tests are just `node -e "console.log(... smoke ok)"`; they provide almost no signal.

Missing coverage:

- Convex functions are not tested with a Convex test harness or realistic mocked DB/auth context.
- Web form behavior is not unit/integration tested with React Testing Library.
- There is no test proving empty/whitespace messages fail in the actual UI and backend together.
- There is no test proving unauthenticated Convex `sendMessage` fails at the function boundary.
- There is no test for realtime subscription behavior, which is the next documented product goal.
- There is no test for generated route/API drift except string assertions.
- There is no accessibility check for the app screen.
- There is no fresh-clone install/build verification separate from local cached state.

Required cleanup:

- Keep the meaningful core tests.
- Replace source-string architecture tests with behavior tests where possible.
- Move the baseline command nesting into `bun run verify` and CI.
- Remove smoke tests or replace them with package-specific behavior.
- Remove `--passWithNoTests` once each package has either real tests or no package-level `test` script.
- Add Convex function tests before expanding message/channel behavior.
- Add Playwright tests for auth failure, empty message, successful message persistence after reload, and basic accessibility/visibility.

### P1: Lint/typecheck is okay, but not enough for AI-generated code quality

Current state:

- Biome recommended rules are enabled.
- TypeScript strict mode is enabled.
- Web package adds `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, and `noUncheckedSideEffectImports`.
- Generated files are ignored by Biome.

Gaps:

- No enforced ban on `any` outside generated files.
- No rule against `@ts-ignore`, unsafe casts, placeholder smoke tests, or empty catches.
- No markdown linting, even though docs are important project state.
- No dependency policy checks.
- No repo rule preventing stale starter text from returning.
- No custom rule/check for forbidden package managers (`npm`, `yarn`, `npx`) in docs/scripts.
- No required test evidence for touched production files beyond the local untracked Codex hook.

Required cleanup:

- Add a repo-local quality script, for example `scripts/quality/check-repo.ts`, to fail on:
  - `any` in non-generated TypeScript,
  - `@ts-ignore`,
  - empty `catch {}`,
  - `console.log` in production code,
  - `passWithNoTests`,
  - `smoke ok`,
  - `npm`, `yarn`, or `npx` in docs except intentional migration notes,
  - starter boilerplate text.
- Add `bun run quality` and include it in `bun run verify` and CI.
- Consider Biome 2 migration deliberately. `bun outdated` shows Biome 2.4.13 is latest, but that is a breaking config migration and should be its own PR.
- Keep generated files excluded from custom checks unless explicitly whitelisted.

### P1: Product scope is over-claimed

The repo says "public API parity from day one" and "self-host v1 Docker Compose only," but the code has only a single hello-world message path. Those decisions may be valid, but they are not represented by working docs, tests, or APIs yet.

Required cleanup:

- Add a product capability matrix in docs with `planned`, `stubbed`, `implemented`, and `tested`.
- Do not call SDK capabilities supported until there is at least one contract test or implementation path behind them.
- Make the README status more explicit: "implemented now" vs "locked architectural direction."

### P2: Code shape is mostly simple, with a few AI-generation smells

The production code is small enough that it can be cleaned without a rewrite.

Issues:

- `apps/web/src/routes/index.tsx` is doing auth form state, session rendering, message querying, mutation, and status handling in one 224-line route component. This is tolerable now, but the next feature will make it messy.
- `convex/messages.ts` duplicates default-space creation/query traversal logic. It is fine for the current slice, but should be factored before adding permissions or more channel/thread APIs.
- `packages/core/src/auth.ts` creates Better Auth memory-backed sessions for tests. That is acceptable as a test harness but should be named/documented as such so agents do not treat it as production auth.
- `packages/ui` and `packages/config` are token stubs. Keep them only if near-term features will use them; otherwise they invite fake package expansion.

Do not refactor broadly yet. Clean the docs and tests first, then extract code only when adding the next real feature.

## External Context Research

The market timing is real. Discord announced global teen-default safety changes on February 9, 2026, then updated the announcement on February 24, 2026 to delay global age assurance until the second half of 2026 and clarify that it does not require universal ID uploads or face scans. This still creates demand for alternatives with clearer privacy, governance, and user control.

Important competitor/context findings:

- Matrix is the strongest open protocol reference point. It defines open APIs for decentralised communication, federation, secure persistence/subscription, IM, VoIP signalling, and optional E2EE.
- Element is the mature sovereign communications competitor. It has self-hosted and managed Matrix deployments, including enterprise, government, and German healthcare positioning.
- Spacebar is the direct Discord-compatible approach. Its docs state a goal of Discord client-server API feature parity and complete self-host control.
- Stoat/Revolt is a practical Discord-like open-source/self-hosted competitor with Docker Compose deployment docs and LiveKit-based voice context.
- Fluxer is very close to Aurora's product framing: free/open-source IM and VoIP for friends, groups, and communities. Its README says self-hosting is coming/evolving and warns users not to dive too deep into current setup yet.
- Convex now has official self-hosting docs. This matters because Aurora's fresh-clone/test story can choose either cloud-dev Convex or self-hosted Convex, but it should be explicit.
- LiveKit Cloud supports region pinning for data residency/GDPR-style use cases, but docs say region pinning is available on the Scale plan or higher and disables automatic nearest-region failover.

Strategic implication: Aurora should not try to beat every Discord alternative by feature breadth. The cleaner wedge is "agent-buildable EU community infrastructure": reproducible dev loop, auditability, explicit policy/permission model, good self-host story, and solid API contract. That fits the current repo better than a consumer feature race.

Sources:

- Discord teen-default announcement: https://discord.com/press-releases/discord-launches-teen-by-default-settings-globally
- Matrix Foundation: https://matrix.org/foundation/about/
- Matrix Specification: https://spec.matrix.org/latest/
- Element Server Suite: https://element.io/en/server-suite
- Spacebar docs: https://docs.spacebar.chat/
- Fluxer repository: https://github.com/fluxerapp/fluxer
- Stoat self-hosted repository: https://github.com/stoatchat/self-hosted
- Convex self-hosting docs: https://docs.convex.dev/self-hosting
- Convex TanStack Start docs: https://docs.convex.dev/client/tanstack/tanstack-start/
- LiveKit region pinning docs: https://docs.livekit.io/deploy/admin/regions/region-pinning/

## Recommended Cleanup Sequence

### Milestone 1: Make the repo honest

1. Add root `AGENTS.md`.
2. Add `.env.example`.
3. Replace stale starter READMEs.
4. Add `docs/agent-runbook.md`.
5. Update README to distinguish implemented functionality from locked goals.
6. Remove or quarantine untracked `.codex/` drafts unless they are intentionally part of the repo.

Acceptance:

- A fresh clone can follow docs without private chat context.
- No tracked docs tell users to run `npm`, `yarn`, or starter commands.
- The current app scope is accurately described.

### Milestone 2: Make verification real

1. Add `bun run verify`.
2. Move nested baseline command checks out of Vitest.
3. Add `bun run quality` for repo-specific AI-slop rules.
4. Replace smoke tests and `--passWithNoTests` with real package tests or no package test script.
5. Add CI jobs for install, typecheck, lint, quality, unit/integration, browser e2e.

Acceptance:

- A future agent has one command for normal validation.
- CI failures point to the actual layer that failed.
- Placeholder tests cannot count as coverage.

### Milestone 3: Test the real backend path

1. Add Convex function tests for auth-required message operations.
2. Add tests for empty message rejection, ordering, persistence, and unauthenticated access.
3. Add a documented disposable test backend path.
4. Add Playwright reload/persistence coverage.

Acceptance:

- The app can be tested from a fresh clone against a known backend mode.
- Message behavior is covered at core, Convex, and browser layers.

### Milestone 4: Only then build the next feature

The next product feature should be permission-aware message posting/read policy or realtime message subscriptions, because those are already documented as next scope. Do not start voice, imports, attachments, or moderation until the base agent loop is reliable.

## Priority Issue List

1. Fresh-clone e2e depends on hidden `.env.local` and remote Convex state.
2. Stale starter docs will mislead future agents.
3. Test suite includes green tests that are structural, slow, or low-signal.
4. No repo-specific quality gate catches common AI-generated slop.
5. Product docs overstate implemented SDK/API/self-host scope.
6. Mobile package is still starter boilerplate.
7. Dependency updates are pending and should be handled in separate deliberate PRs.

## Commands Run

- `bun run test`: passed.
- `bun run test:e2e:browser`: passed.
- `bun outdated`: showed Convex, Turbo, Playwright, Biome, Vitest, TypeScript, and Node types updates available.
- `gt --version`: Graphite CLI available, version 1.8.5.

## Execution Progress

### Milestone 1: Make the repo honest

Addressed in Graphite branch `repo-refresh-docs-runtime-honesty`.

- Added root `AGENTS.md`.
- Added `.env.example`.
- Replaced stale starter READMEs for root, web, and Convex.
- Added `docs/agent-runbook.md`.
- Updated mobile starter copy to a minimal Aurora placeholder shell.
- Ignored local `.codex/` drafts.

### Milestone 2: Make verification real

Addressed in Graphite branch `repo-refresh-verification-guardrails`.

- Added `bun run verify`.
- Added `bun run quality`.
- Removed nested baseline command checks from Vitest.
- Removed placeholder smoke tests and `--passWithNoTests` package scripts.
- Added CI quality and local browser-e2e steps.

### Milestone 3: Test the real backend path

Partially addressed in Graphite branch `repo-refresh-convex-message-tests`.

- Added direct Convex message function tests with `convex-test`.
- Covered unauthenticated access, empty-message rejection, body trimming, ordering, and persistence.
- Remaining backend coverage gap: broader channel/thread and permission behavior should be directly tested before those features expand.
