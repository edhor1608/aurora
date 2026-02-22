# Sprint 1 Vertical Slice Notes

## Delivered in this increment

- Replaced custom auth session fabrication with Better Auth-backed session issuance (`better-auth` + memory adapter) in `packages/core/src/auth.ts`.
- Introduced core permissioned text-flow primitives (`createCommunity`, `addMember`, `createChannel`, `sendMessage`, `listMessages`).
- Expanded test-first coverage for auth/session and permissioned message flow.
- Wired Convex runtime (`convex/convex.config.ts`, `convex/auth.config.ts`, `convex/auth.ts`, `convex/http.ts`) with Better Auth token route support (`/api/auth/convex/token`) and cloud deployment.
- Migrated web runtime to TanStack Start with auth handler route (`apps/web/src/routes/api/auth.$.ts`) using `convexBetterAuthReactStart`.
- Enabled `ConvexBetterAuthProvider` + Better Auth client plugin wiring in web for authenticated Convex query/mutation calls.
- Persisted default space hierarchy in Convex (`community -> channel -> thread`) with real message insertion/listing via public `messages.sendMessage` + `messages.listMessages`.

## Test coverage added

- Unit: Better Auth-backed session issuance + lifecycle checks.
- Integration: create community -> create channel -> send/list message, plus denied cases (expired session, non-member, channel deny override).

## Remaining gap to full Sprint 1 objective

- Add permission-aware message posting/read rules beyond basic session checks.
- Add realtime subscription UX (live updates) instead of manual refresh.
- Expand auth and channel/thread APIs from hello-world path to broader v1 spec coverage.
