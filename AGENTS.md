# Aurora Agent Guide

## Priorities

- Keep changes small, boring, and easy to review.
- Reuse existing patterns before adding new abstractions.
- Do not refactor, rename, or restructure unless the task explicitly asks for it.
- Explain the reason for a change before editing when the tradeoff is not obvious.

## TypeScript

- Do not use `any` outside generated files unless there is no safer option.
- Prefer `satisfies` and `as const` for literal objects and fixed option sets.
- Keep strict TypeScript green with `bun run typecheck`.

## Package Manager

- Use Bun for repo commands.
- Do not add `npm`, `yarn`, or starter-package-manager commands to docs or scripts.

## Workflow

- Use Graphite for branch, stack, and PR work.
- Run `gt log` before branch work.
- Use `gt create`, `gt modify`, `gt restack`, `gt sync`, and `gt submit` for branch and PR operations.
- Use plain `git` for working-tree inspection only, such as `git status`, `git diff`, and `git add`.

## Local Setup

1. Install dependencies with `bun install`.
2. Copy `.env.example` to `.env.local` and fill `SITE_URL`, `BETTER_AUTH_SECRET`, `VITE_CONVEX_URL`, and `VITE_CONVEX_SITE_URL`.
3. Push Convex functions and regenerate types with `bunx convex dev --once`.
4. Start the web app with `bun run --filter @aurora/web dev`.
5. Run normal validation with `bun run verify`.
6. Run browser e2e with `bun run test:e2e:browser` only when `.env.local` points at a usable Convex deployment.

## Docs Expectations

- Update branch knowledge under `docs/plans/` when a branch changes repo behavior, setup, tests, or architecture.
- Keep docs honest about what is implemented now versus planned.
- Persist architectural decisions in `docs/plans/decisions-log.md` using Context, Decision, Rationale, and Consequences.
