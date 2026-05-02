# Repo Refresh Merge Plan (2026-05-02)

## Context

The Repo Refresh Audit work is submitted as a five-PR Graphite stack. All PRs are currently draft PRs and should be merged bottom-up, with a review and verification checkpoint at each step.

Current stack order:

1. PR #9: `repo-refresh-docs-runtime-honesty`
2. PR #10: `repo-refresh-verification-guardrails`
3. PR #11: `repo-refresh-convex-message-tests`
4. PR #12: `repo-refresh-capability-matrix`
5. PR #13: `repo-refresh-browser-message-coverage`

## Confidence

I am comfortable handling the merge process end-to-end, with a confidence level around 8/10. The stack was split deliberately, the top branch verified locally, and each PR has a narrow purpose. The main risk is not the stack shape; it is CI or environment-specific drift, especially around the verification and Convex test harness changes.

The user should not need to personally test every PR unless they want to review wording or product direction. The highest-value human review targets are PR #10 and PR #11 because they change repository gates and backend test infrastructure.

## Review Policy Before Merge

Each PR should get a normal code review before merging, even if CodeRabbit has already reviewed part of the stack. The review should focus on regressions, bad assumptions, missing tests, and whether the PR does exactly what its title says without extra scope.

For each PR:

1. Read the diff directly.
2. Check whether CodeRabbit already posted a useful review.
3. If CodeRabbit review is missing because of rate limits, try the CodeRabbit CLI review path:
   - Confirm CLI: `coderabbit --version`
   - Confirm auth: `coderabbit auth status --agent`
   - Review the committed diff: `coderabbit review --agent -t committed -c AGENTS.md`
4. If the CLI is unavailable, unauthenticated, rate-limited, or times out, do a manual review and record that it was manual.
5. Fix real review findings on the relevant branch, then `gt modify`, `gt restack`, and `gt submit --stack`.

Do not treat CodeRabbit as the only review gate. It is useful, but normal engineering review still applies.

## Merge Order And Gates

### PR #9: Document repo refresh runtime setup

Link: https://app.graphite.com/github/pr/edhor1608/aurora/9

Purpose: Make the repo honest and fresh-clone-readable with `AGENTS.md`, `.env.example`, runbook docs, starter doc cleanup, and mobile placeholder copy.

Review focus:

- Docs are accurate and do not overclaim product readiness.
- No private/local state is committed.
- Setup instructions use Bun and match the actual scripts.

Gate before merge:

- `bun run quality`
- `bun run test -- tests/snapshot/docs.snapshot.test.ts`

Risk: Low.

### PR #10: Add repo verification guardrails

Link: https://app.graphite.com/github/pr/edhor1608/aurora/10

Purpose: Add `bun run verify`, add `bun run quality`, remove placeholder smoke/pass-with-no-tests package scripts, move command verification out of Vitest, and update CI.

Review focus:

- `scripts/quality/check-repo.ts` does not create noisy false positives.
- Removed package-level tests were placeholders, not real coverage.
- CI steps match the new local verification model.
- Browser e2e skipping is explicit and safe when env is missing.

Gate before merge:

- `bun run verify`

Risk: Medium. This changes the repo's main validation path.

### PR #11: Add Convex message behavior tests

Link: https://app.graphite.com/github/pr/edhor1608/aurora/11

Purpose: Add direct Convex message function coverage for unauthenticated access, empty-message rejection, trimming, ordering, and persistence.

Review focus:

- `convex-test` and Better Auth component registration are scoped to tests.
- No duplicate Convex package/type instance is introduced.
- Tests prove behavior, not just source strings.
- Test runtime is acceptable.

Gate before merge:

- `bun run typecheck`
- `bun run test -- tests/integration/convex-messages.integration.test.ts`
- `bun run verify` if CI is unavailable or inconclusive.

Risk: Medium. This touches the backend test harness and dependencies.

### PR #12: Document capability status matrix

Link: https://app.graphite.com/github/pr/edhor1608/aurora/12

Purpose: Add `docs/capabilities.md` so implemented, tested, stubbed, and planned capabilities are explicit.

Review focus:

- Capability statuses are honest.
- Planned features are not described as supported.
- README/runbook links are clear.

Gate before merge:

- `bun run quality`
- `bun run test -- tests/snapshot/docs.snapshot.test.ts`

Risk: Low.

### PR #13: Expand browser message coverage

Link: https://app.graphite.com/github/pr/edhor1608/aurora/13

Purpose: Extend Playwright coverage for persisted messages after reload and empty-message rejection.

Review focus:

- Tests are stable and do not depend on brittle timing.
- Existing auth helper still behaves correctly.
- The test does not require hidden data beyond the documented Convex env path.

Gate before merge:

- `bun run test:e2e:browser` when `.env.local` points at a usable Convex deployment.
- `bun run verify` on the top branch after all restacks.

Risk: Low to medium because browser tests depend on local/CI env.

## Step-By-Step Merge Procedure

1. Start from the top branch and run `gt sync`.
2. Run `gt restack`.
3. Inspect the stack with `gt log`.
4. For PR #9, review diff, run gates, resolve findings, submit updates if needed, then merge through Graphite.
5. After #9 merges, sync and restack the remaining stack.
6. Repeat the same review/gate/merge cycle for PR #10, #11, #12, and #13 in order.
7. After the final PR merges, sync back to `main`.
8. Run `bun run verify` on updated `main`.
9. If Convex env is available, also run `bun run test:e2e:browser` on `main`.
10. Record final status in the audit plan or project status notes.

## When To Stop And Ask The User

Stop instead of merging if:

- Graphite or GitHub requires user approval/permissions.
- CI fails for a reason that implies a product or policy decision.
- CodeRabbit or manual review finds a major issue that is not a straightforward fix.
- A merge conflict changes behavior outside the PR's stated scope.
- A PR needs to move out of draft and that requires a user decision.

## Recommended Human Involvement

Minimal involvement path: I handle the reviews, fixes, restacks, verification, and Graphite merges, then report blockers only.

Targeted involvement path: the user personally reviews PR #10 and PR #11, while I handle #9, #12, and #13.

Full involvement path: the user reviews and tests each PR manually before I merge. This is safest, but likely more effort than the stack needs.
