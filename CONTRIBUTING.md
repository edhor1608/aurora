# Contributing

## Requirements

- Node `22` (`.nvmrc`) and Bun `1.3.6`.
- Keep changes small and focused.
- Add tests first for behavior changes.

## Workflow

1. Create a branch from `main` using `codex/*`, `feat/*`, `fix/*`, `chore/*`, or `docs/*`.
2. Implement with TDD.
3. Run:
   - `bun run typecheck`
   - `bun run lint`
   - `bun run test`
4. Open a pull request with passing checks.

## Compatibility and API Discipline

Aurora treats third-party clients as first-class. Public API behavior and capability contracts must remain stable and versioned.
