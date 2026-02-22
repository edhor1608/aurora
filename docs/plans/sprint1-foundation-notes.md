# Sprint 1 Foundation Notes

## What worked

- Monorepo starters (web/mobile/convex/packages) established a stable baseline quickly.
- Workspace gates through Turbo (`typecheck`, `lint`) remained deterministic across packages.
- Layered test strategy (unit/integration/snapshot/e2e + Playwright browser e2e) kept refactors safe.

## What was adjusted

- Web routing/auth integration was aligned to the official Convex Better Auth + TanStack Start guide:
  - SSR query integration in router.
  - auth token handoff in root `beforeLoad`.
  - `ConvexBetterAuthProvider` with `initialToken`.
- Repo baseline e2e command test timeouts were raised to avoid false negatives during full workspace checks.

## Delivered in Sprint 1 foundation scope

- Real auth/session flow is wired with Better Auth and Convex.
- Real persisted message flow is wired (`community -> channel -> thread -> message`).
- CI/local parity is established for baseline gates.

## Remaining deferred scope

- Full permission matrix and moderation pipeline.
- Import pipeline and attachment policy implementation.
- Voice runtime implementation beyond locked target definitions.
