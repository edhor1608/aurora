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

## ADR-S1-005

- Context: The initial vertical slice used hand-rolled session objects, which conflicts with the project direction to standardize on Better Auth.
- Decision: Replace manual session creation with Better Auth-backed session issuance in `packages/core/src/auth.ts`, using the memory adapter for Sprint 1 test/runtime scaffolding.
- Rationale: Aligns implementation with auth stack choice early and avoids growing custom auth logic that would be discarded later.
- Consequences: Auth session creation is now async and test coverage validates Better Auth behavior directly.

## ADR-S1-006

- Context: Better Auth should integrate directly with Convex for runtime auth, not as an isolated in-memory setup.
- Decision: Add Convex-native Better Auth scaffolding in `convex/auth.config.ts`, `convex/auth.ts`, and `convex/http.ts` using `@convex-dev/better-auth` (`getAuthConfigProvider`, `createClient`, `convex` plugin).
- Rationale: Matches official Better Auth + Convex integration guidance and keeps auth architecture aligned with Convex as the backend authority.
- Consequences: Sprint 1 now includes a typed integration surface for Convex auth wiring, while core in-memory helpers remain test harness code until runtime endpoints are connected.

## ADR-S1-007

- Context: Sprint 1 needed a first real end-to-end slice (frontend + auth + persisted message), not only scaffolding/tests.
- Decision: Implement a minimal production-shaped flow: web login/sign-up via TanStack Start Better Auth handler routes (`/api/auth/$`) and real Convex-backed message persistence through public `messages.sendMessage` and `messages.listMessages` using default community/channel/thread records.
- Rationale: Provides a runnable user path (authenticate, post, read) while preserving long-term model primitives.
- Consequences: We now have a concrete integration baseline to iterate on (permissions, richer channel/thread UX, realtime subscriptions) without rewriting the auth/database foundation.

## ADR-S1-008

- Context: TanStack Start + Better Auth + Convex integration patterns evolve quickly and drift from official wiring increases runtime/SSR risk.
- Decision: Treat the official Convex Better Auth TanStack Start framework guide as the canonical wiring baseline and align router/root/auth client setup to it (`setupRouterSsrQueryIntegration`, root token handoff, provider `initialToken` flow).
- Rationale: Reduces integration guesswork and keeps the project aligned with the supported upstream approach.
- Consequences: Architecture conformance tests now guard the expected official integration shape.

## ADR-S1-009

- Context: Baseline command e2e test timeouts produced false negatives when full workspace commands exceeded one-minute subprocess limits.
- Decision: Increase subprocess and test-level timeouts in the baseline command e2e test to account for realistic workspace execution time.
- Rationale: Preserves the purpose of the baseline gate while removing flaky timeout failures.
- Consequences: Baseline command e2e remains strict on exit codes but is stable under normal local/CI runtime variance.
