# Aurora EU Community Platform

Aurora is a European open community platform with Discord-like servers/channels, a Convex-first realtime core, and cloud plus self-host deployment.

## Sprint 1 Foundation Scope

- Monorepo foundation with web, mobile, Convex, and shared packages.
- Public API contract baseline from day one.
- AGPL-3.0 governance and contributor docs.
- Decision and architecture mirrors under `/docs`.

## Repository Layout

- `apps/web` TanStack-based web starter.
- `apps/mobile` Expo mobile starter.
- `convex` realtime backend scaffold.
- `packages/core` domain primitives and policy logic.
- `packages/sdk` versioned API contract types.
- `packages/ui` shared UI tokens.
- `packages/config` shared runtime constants.
- `docs` mirrored decision and architecture references.

## Baseline Commands

- `bun run typecheck`
- `bun run lint`
- `bun run test`

## Hello World Vertical Slice

1. Ensure Convex functions are pushed: `bunx convex dev --once`
2. Start web app: `bun run --filter @aurora/web dev`
3. Open `http://localhost:3000`
4. Use **Sign up** (or **Sign in**) and then send a message in **Hello Message**

This flow is wired end-to-end through TanStack Start auth handlers (`/api/auth/$`) and Convex query/mutation APIs (`messages.listMessages`, `messages.sendMessage`) with persisted `community -> channel -> thread -> message` records.

## Locked Decisions

See `/docs/decisions.md` for enforced D-101 to D-107 locks.

<!-- status:start -->
## Status
- State: active
- Summary: First runnable auth + persisted hello-message slice is wired.
- Next: Add permission enforcement + realtime live updates.
- Updated: 2026-02-22
- Branch: `codex/p20-s1-vertical-slice`
- Working Tree: dirty
- Last Commit: 0d7e830 (2026-02-22) feat(convex): scaffold direct better-auth integration
<!-- status:end -->
