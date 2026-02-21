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

## Locked Decisions

See `/docs/decisions.md` for enforced D-101 to D-107 locks.

<!-- status:start -->
## Status
- State: active
- Summary: Define current milestone.
- Next: Define next concrete step.
- Updated: 2026-02-21
- Branch: `main`
- Working Tree: dirty (2 files)
- Last Commit: 746914d (2026-02-19) chore: add repository CODEOWNERS (#4)
<!-- status:end -->
