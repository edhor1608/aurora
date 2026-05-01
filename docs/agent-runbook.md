# Agent Runbook

## Current Product State

Aurora currently has one real vertical slice: a TanStack Start web page signs users up or in through Better Auth, then sends and lists messages through Convex. The persisted data shape is `community -> channel -> thread -> message`.

Mobile is a placeholder shell, not a shipped product surface. Self-hosting, public API parity, voice, moderation, imports, and broad channel/thread management are documented product directions, not implemented capabilities.

## Fresh Clone Setup

1. Install Bun 1.3.6 and Node 22.
2. Run `bun install`.
3. Copy `.env.example` to `.env.local`.
4. Set `VITE_CONVEX_URL` and `VITE_CONVEX_SITE_URL` from the Convex deployment selected for local development.
5. Set `SITE_URL` to the web origin, normally `http://localhost:3000`.
6. Set `BETTER_AUTH_SECRET` to a local secret string.
7. Run `bunx convex dev --once` to push functions and regenerate `convex/_generated` types.
8. Run `bun run --filter @aurora/web dev` and open `http://localhost:3000`.

The browser e2e test depends on a usable Convex deployment and `.env.local`. Unit and integration tests do not require private local credentials.

## Validation Commands

- `bun run typecheck` checks TypeScript across workspaces.
- `bun run lint` runs Biome across workspaces.
- `bun run quality` runs repo-specific generated-code-smell guardrails.
- `bun run test` runs repository Vitest tests.
- `bun run verify` runs the normal typecheck, lint, quality, Vitest, and local browser e2e gate.
- `bun run test:e2e:browser` runs Playwright against the web app and should be used when Convex env is configured.

## Development Loop

Start with `gt log` before branch work. Create focused Graphite branches with `gt create`, keep each branch reviewable, and submit with `gt submit` or `gt submit --stack`.

For code changes, prefer the smallest fix that addresses the root cause. Do not add speculative abstractions or package stubs. When changing setup, tests, or architecture, update the relevant docs in the same branch.

## Known Gaps From The 2026-05-01 Audit

- Convex message behavior has direct tests for auth-required access, empty-message rejection, trimming, ordering, and persistence. Broader channel/thread and permission behavior still needs direct Convex coverage.
- Browser e2e coverage is still limited to the basic auth and message path.
- CI skips browser e2e unless Convex env is configured.
