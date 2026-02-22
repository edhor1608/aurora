# Sprint 1 Decisions Log

## ADR-S1-001

- Context: Sprint 1 needs a runnable, reviewable foundation without shipping product domain features.
- Decision: Scope Sprint 1 to monorepo foundation, tooling, docs traceability, and CI gates only.
- Rationale: Keeps risk low while enforcing structure and quality gates early.
- Consequences: Auth/domain/voice implementation is explicitly deferred.

## ADR-S1-002

- Context: Tooling compatibility varies across ecosystem packages.
- Decision: Pin Node to 22 LTS in-repo and keep Bun as package runner.
- Rationale: Improves compatibility with Expo/TanStack/TypeScript tooling.
- Consequences: Contributors on newer Node versions should switch via `.nvmrc` for development.

## ADR-S1-003

- Context: D-101 says Convex Cloud EU primary but includes availability caveat.
- Decision: Mirror a temporary fallback gate note in repo docs, requiring explicit ADR before any non-EU fallback.
- Rationale: Avoids silent drift from EU-first operating model.
- Consequences: Cloud fallback remains an open governance decision.

## ADR-S1-004

- Context: Sprint 1 plan expects a first permissioned text flow, but the repository only had foundation scaffolding.
- Decision: Implement a core-level vertical slice first (session lifecycle + permissioned text flow in `packages/core`) with TDD before wiring web/mobile/convex runtime endpoints.
- Rationale: Delivers verifiable domain behavior quickly while keeping integration complexity bounded.
- Consequences: Product logic is now testable and reusable, but UI/backend integration work is still required for end-user flow.
