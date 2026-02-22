# Sprint 1 Vertical Slice Notes

## Delivered in this increment

- Replaced custom auth session fabrication with Better Auth-backed session issuance (`better-auth` + memory adapter) in `packages/core/src/auth.ts`.
- Added core permissioned text-flow primitives (`createCommunity`, `addMember`, `createChannel`, `sendMessage`, `listMessages`).
- Added test-first coverage for auth/session and permissioned message flow.
- Added Convex runtime wiring (`convex/convex.config.ts`, `convex/auth.config.ts`, `convex/auth.ts`, `convex/http.ts`) and initialized cloud deployment.
- Added first web login + message flow UI with TanStack routes and Vite proxy to Convex auth/message HTTP endpoints.
- Added persisted default space hierarchy in Convex (`community -> channel -> thread`) and real message insertion/listing on top.

## Test coverage added

- Unit: Better Auth-backed session issuance + lifecycle checks.
- Integration: create community -> create channel -> send/list message, plus denied cases (expired session, non-member, channel deny override).

## Remaining gap to full Sprint 1 objective

- Add permission-aware message posting/read rules beyond basic session checks.
- Add realtime subscription UX (live updates) instead of manual refresh.
- Expand auth and channel/thread APIs from hello-world path to broader v1 spec coverage.
