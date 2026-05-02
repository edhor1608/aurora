# Aurora Convex Backend

This directory contains Aurora's current backend slice:

- Better Auth integration in `auth.ts` and `http.ts`.
- Required backend env parsing in `env.ts`.
- Default community/channel/thread/message schema in `schema.ts`.
- Message query and mutation functions in `messages.ts`.

## Local Setup

1. Copy `.env.example` to `.env.local` at the repo root.
2. Fill `SITE_URL`, `BETTER_AUTH_SECRET`, `VITE_CONVEX_URL`, and `VITE_CONVEX_SITE_URL`.
3. Push functions and regenerate types with `bunx convex dev --once`.
4. Start the web app with `bun run --filter @aurora/web dev`.

`convex/_generated` is committed because the web app imports generated API types. Regenerate it after adding, removing, or renaming Convex modules.

## Auth And Messages

All message functions require an authenticated Better Auth user. `sendMessage` trims message bodies and rejects empty messages. `listMessages` returns the latest messages for the default thread in ascending display order.

## Tests

Current repository tests cover the core text flow and browser path, but direct Convex function tests are still a known gap. Add those before expanding message, channel, or permission behavior.
