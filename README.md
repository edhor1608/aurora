# Aurora

Aurora is an early European open community platform. The current repo proves one end-to-end slice: web auth, Convex-backed message persistence, and shared domain primitives.

The broader direction is Discord-like communities with EU-first operation, public APIs, and self-host support. Those are locked product goals, not all implemented features.

## Implemented Now

- TanStack Start web app with Better Auth sign-up, sign-in, and sign-out.
- Convex functions for the default community, channel, thread, and messages.
- Core package tests for permissions, sessions, and text flow.
- Playwright browser e2e for the basic auth and message path when Convex env is configured.
- AGPL-3.0 license and architecture/decision notes under `docs/`.

## Repository Layout

- `apps/web` TanStack Start web app.
- `apps/mobile` minimal Expo placeholder shell.
- `convex` Better Auth and message backend functions.
- `packages/core` domain primitives and policy logic.
- `packages/sdk` versioned API contract types.
- `packages/ui` shared UI tokens.
- `packages/config` shared runtime constants.
- `docs` mirrored decision and architecture references.

## Setup

1. Install dependencies: `bun install`
2. Copy `.env.example` to `.env.local`, set `SITE_URL` to the app origin, generate a local `BETTER_AUTH_SECRET`, and fill `VITE_CONVEX_URL` plus `VITE_CONVEX_SITE_URL`.
3. Push Convex functions and regenerate types: `bunx convex dev --once`
4. Start the web app: `bun run --filter @aurora/web dev`
5. Open `http://localhost:3000`

See `docs/agent-runbook.md` for the full agent workflow and known gaps.

## Validation

- `bun run typecheck`
- `bun run lint`
- `bun run test`
- `bun run test:workspaces`
- `bun run test:e2e:browser` when `.env.local` points at a usable Convex deployment

## Hello World Vertical Slice

1. Start the web app.
2. Use **Sign up** or **Sign in**.
3. Send a message in **Hello Message**.

This flow is wired end-to-end through TanStack Start auth handlers (`/api/auth/$`) and Convex query/mutation APIs (`messages.listMessages`, `messages.sendMessage`) with persisted `community -> channel -> thread -> message` records.

## Locked Decisions

See `/docs/decisions.md` for enforced D-101 to D-107 locks.

<!-- status:start -->
## Status

- State: active
- Summary: One Better Auth + Convex + TanStack Start vertical slice is runnable; broader platform capabilities are planned.
- Next: make verification reproducible, then add permission-aware channel/thread policy enforcement and live message subscriptions.
- Updated: 2026-05-01
<!-- status:end -->
