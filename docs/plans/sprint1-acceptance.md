# Sprint 1 Foundation Acceptance Map

## Command Gates

- Type checks must pass across all workspace packages: `bun run typecheck`.
- Linting must pass with Biome checks: `bun run lint`.
- The full layered suite must pass: `bun run test`.

## Test Layer Coverage

- Unit: permission resolver and SDK capability contract.
- Integration: repository structure, governance docs, runtime pinning.
- Snapshot: mirrored decision and architecture docs.
- E2E (CLI): executes baseline workspace command flow.
- E2E (browser): validates sign-up/sign-in and persisted hello-message flow.

## Locked Decision Assertions

- D-101 Convex Cloud EU primary with explicit fallback governance note.
- D-102 LiveKit Cloud EU.
- D-103 voice target 25 concurrent users.
- D-104 architecture target 100k members.
- D-105 AGPL-3.0 repo-wide.
- D-106 full parity public API from day one.
- D-107 Docker Compose only for self-host v1.
