# Aurora Web App

TanStack Start web app for Aurora's current auth and message vertical slice.

## Getting Started

```bash
bun install
bunx convex dev --once
bun run --filter @aurora/web dev
```

The app expects `.env.local` at the repo root. Copy `.env.example` and fill `VITE_CONVEX_URL`, `VITE_CONVEX_SITE_URL`, `SITE_URL`, and `BETTER_AUTH_SECRET`.

## Build

```bash
bun run --filter @aurora/web build
```

## Test

```bash
bun run test
bun run test:e2e:browser
```

Run the browser e2e command only when `.env.local` points at a usable Convex deployment.

## Scope

Implemented behavior is intentionally small: sign up, sign in, sign out, send a message, and list persisted messages in the default community/thread.
