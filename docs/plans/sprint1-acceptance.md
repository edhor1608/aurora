# Sprint 1 Foundation Acceptance Map

## Command Gates

- `bun run typecheck` must pass across all workspace packages.
- `bun run lint` must pass with Biome checks.
- `bun run test` must pass the layered suite.

## Test Layer Coverage

- Unit: permission resolver and SDK capability contract.
- Integration: repository structure, governance docs, runtime pinning.
- Snapshot: mirrored decision and architecture docs.
- E2E: executes baseline workspace command flow.

## Locked Decision Assertions

- D-101 Convex Cloud EU primary with explicit fallback governance note.
- D-102 LiveKit Cloud EU.
- D-103 voice target 25 concurrent users.
- D-104 architecture target 100k members.
- D-105 AGPL-3.0 repo-wide.
- D-106 full parity public API from day one.
- D-107 Docker Compose only for self-host v1.
