# Sprint 1 Vertical Slice Notes

## Delivered in this increment

- Replaced custom auth session fabrication with Better Auth-backed session issuance (`better-auth` + memory adapter) in `packages/core/src/auth.ts`.
- Added core permissioned text-flow primitives (`createCommunity`, `addMember`, `createChannel`, `sendMessage`, `listMessages`).
- Added test-first coverage for auth/session and permissioned message flow.

## Test coverage added

- Unit: Better Auth-backed session issuance + lifecycle checks.
- Integration: create community -> create channel -> send/list message, plus denied cases (expired session, non-member, channel deny override).

## Remaining gap to full Sprint 1 objective

- Wire these core flows into real runtime surfaces (Convex mutations/actions and client app flows).
