# Test Matrix

## Layers

- `tests/unit/*`: isolated logic and contract tests
- `tests/integration/*`: cross-module behavior (Convex + auth + repo architecture)
- `tests/e2e/playwright/*`: browser E2E via Playwright

## Commands

- `bun run test`: Vitest unit, integration, and snapshot suite
- `bun run quality`: repo-specific guardrails for generated-code smells
- `bun run verify`: typecheck, lint, quality, Vitest, and browser E2E when env is configured
- `bun run test:e2e:browser`: Playwright Chromium browser E2E, requires the browser/backend env to be configured
- `bun run test:e2e:browser:local`: runs `scripts/run-browser-e2e-if-env.ts`, which skips Playwright when any required env var is missing
- `bun run test:e2e:browser:headed`: Playwright headed run
