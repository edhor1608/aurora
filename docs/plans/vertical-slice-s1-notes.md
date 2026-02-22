# Sprint 1 Vertical Slice Notes

## Delivered in this increment

- Added core auth session primitives (`createSession`, `isSessionActive`, `assertActiveSession`).
- Added core permissioned text-flow primitives (`createCommunity`, `addMember`, `createChannel`, `sendMessage`, `listMessages`).
- Added test-first coverage for auth/session and permissioned message flow.

## Test coverage added

- Unit: auth session lifecycle checks.
- Integration: create community -> create channel -> send/list message, plus denied cases (expired session, non-member, channel deny override).

## Remaining gap to full Sprint 1 objective

- Wire these core flows into real runtime surfaces (Convex mutations/actions and client app flows).
