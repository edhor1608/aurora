# Capability Matrix

Aurora uses these statuses to keep docs honest:

- `implemented`: working code exists in the repo.
- `tested`: automated tests cover the behavior.
- `stubbed`: a package, type surface, or placeholder exists, but the behavior is not usable.
- `planned`: the capability is documented direction only.

`tested` implies `implemented`; use `implemented` only when working code exists without automated coverage yet.

| Capability | Status | Evidence |
| --- | --- | --- |
| Web sign up, sign in, and sign out | tested | `apps/web/src/routes/index.tsx`, `tests/e2e/playwright/auth-and-message.spec.ts` |
| Default community/channel/thread creation | tested | `convex/messages.ts`, `tests/integration/convex-messages.integration.test.ts` |
| Message send/list persistence | tested | `convex/messages.ts`, `tests/integration/convex-messages.integration.test.ts`, `tests/integration/text-flow.integration.test.ts` |
| Empty message rejection | tested | `convex/messages.ts`, `tests/integration/convex-messages.integration.test.ts` |
| Core permission resolution | tested | `packages/core/src/permissions.ts`, `tests/unit/core-permissions.test.ts` |
| Better Auth session harness | tested | `packages/core/src/auth.ts`, `tests/unit/auth-session.test.ts` |
| Mobile app | stubbed | `apps/mobile/App.tsx` is a placeholder shell |
| SDK package | stubbed | `packages/sdk/src/index.ts` exports contract types only |
| Shared UI package | stubbed | `packages/ui/src/index.ts` exports tokens only |
| Shared config package | stubbed | `packages/config/src/index.ts` exports constants only |
| Permission-aware Convex channel/thread policy | planned | Not implemented yet; current observation: no Convex function enforces channel membership or permission overrides. TODO: link issue/PR when opened. |
| Realtime message subscription UX | planned | Not implemented yet; current observation: Convex queries exist, but no tested subscription behavior or live update workflow is documented. TODO: link issue/PR when opened. |
| Public API parity | planned | Not implemented yet; current observation: no external API contract tests or implementation path exists. TODO: link issue/PR when opened. |
| Self-host Docker Compose | planned | Not implemented yet; current observation: no Compose file or self-host runbook exists. TODO: link issue/PR when opened. |
| Voice/LiveKit | planned | Not implemented yet; current observation: no LiveKit integration exists. TODO: link issue/PR when opened. |
| Moderation and audit controls | planned | Not implemented yet; current observation: no moderation schema, UI, or tests exist. TODO: link issue/PR when opened. |
| Attachments/import pipeline | planned | Not implemented yet; current observation: no file storage, import, or attachment flow exists. TODO: link issue/PR when opened. |

Do not mark a capability as `implemented` or `tested` unless it meets the matrix criteria and has evidence linked in this table.
