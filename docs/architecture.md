# Architecture Mirror (Repo Local)

## Component Map

1. Identity and access layer (`Better-Auth` session lifecycle and membership resolution).
2. Domain core (`packages/core`) for deterministic policy and validation.
3. Realtime backend (`convex`) for data model, functions, and events.
4. Client apps (`apps/web`, `apps/mobile`).
5. Public API/SDK (`packages/sdk`) with versioned capabilities.
6. Media layer for upload policy and signed URL issuance.
7. Moderation/audit controls and abuse limits.
8. Minimal voice module (presence, join/leave, mute/deafen) with 25-user MVP target.

## Architecture Constraints

- Cloud mode: Convex Cloud EU primary.
- Voice mode: LiveKit Cloud EU.
- Self-host v1 packaging: Docker Compose only.
- API governance: full parity public API from day one.

## Key Data Flows

- Message send: client -> permissioned mutation -> append -> realtime subscription update.
- Attachment upload: client -> upload token -> storage -> attachment record.
- Moderation: report -> queue -> action -> immutable audit log.

## Source References

- `/Users/jonas/Library/Mobile Documents/iCloud~md~obsidian/Documents/Coding/Projekte/P20 Aurora EU Community Platform/docs/architecture_blueprint.md`
- `/Users/jonas/Library/Mobile Documents/iCloud~md~obsidian/Documents/Coding/Projekte/P20 Aurora EU Community Platform/docs/v1_spec.md`
- `/Users/jonas/Library/Mobile Documents/iCloud~md~obsidian/Documents/Coding/Projekte/P20 Aurora EU Community Platform/docs/implementation_plan.md`
