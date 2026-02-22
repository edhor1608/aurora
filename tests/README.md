# Test Matrix

## Layers

- `tests/unit/*`: isolated logic and contract tests
- `tests/integration/*`: cross-module behavior (Convex + auth + repo architecture)
- `tests/e2e/baseline-checks.e2e.test.ts`: repository-level command gates
- `tests/e2e/playwright/*`: browser E2E via Playwright

## Commands

- `bun run test`: full Vitest suite (unit + integration + repository e2e checks)
- `bun run test:e2e:browser`: Playwright Chromium browser E2E
- `bun run test:e2e:browser:headed`: Playwright headed run
