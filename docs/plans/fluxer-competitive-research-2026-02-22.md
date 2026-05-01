# Fluxer Competitive Research (2026-02-22)

## Context

This note captures a direct comparison between Aurora and Fluxer so the findings are preserved in-repo and can be referenced in planning, prioritization, and ADR work.

Date captured: 2026-02-22

## Aurora Baseline (Current)

- Aurora positioning is EU/open/Discord-like with Convex-first realtime and cloud plus self-host direction:
  - `README.md`
- Current shipped experience is a hello-world auth + single-thread message flow:
  - `apps/web/src/routes/index.tsx`
  - `convex/messages.ts`
- Mobile remains a placeholder shell:
  - `apps/mobile/App.tsx`
- Next documented scope is permission-aware policies + live message subscriptions:
  - `README.md`
  - `docs/plans/vertical-slice-s1-notes.md`
- Deferred scope still includes moderation, attachments/import pipeline, and voice runtime:
  - `docs/plans/sprint1-foundation-notes.md`
- Locked constraints include EU cloud primary, LiveKit EU, 25 concurrent voice MVP, 100k architecture target, full parity public API day one, and Docker Compose self-host v1:
  - `docs/decisions.md`

## Fluxer Snapshot (External)

- Fluxer is a public beta Discord-like platform:
  - https://fluxer.app/
- Open-source repository with visible traction/activity:
  - https://github.com/fluxerapp/fluxer
- Native desktop available; mobile native listed as underway (PWA interim):
  - https://fluxer.app/download
  - https://blog.fluxer.app/roadmap-2026/
- Privacy docs state no default E2EE posture today:
  - https://fluxer.app/privacy
- Self-host docs exist but key pages are still mostly TBD:
  - https://docs.fluxer.app/self_hosting/overview
  - https://docs.fluxer.app/self_hosting/quickstart

## Head-to-Head Assessment

- Aurora advantage: clearer architecture intent and explicit governance constraints.
- Fluxer advantage: currently shipped product surface and user-facing maturity.
- Current reality: Aurora has stronger infrastructure thesis; Fluxer has stronger execution/distribution status right now.

## Strategic Challenges To Aurora

1. Scope risk: locked requirements combine API parity + self-host + voice + moderation + scale targets before product maturity is proven.
2. Time-to-value risk: current vertical slice is strong technically but not yet a broad adoption experience.
3. Positioning risk: "Discord alternative" positioning is crowded unless Aurora wins on a sharper wedge than feature parity.

## Where Aurora Can Win

1. Compliance-grade EU operating model with auditable controls (not only EU branding).
2. Strong developer/operator API product with reliable parity and explicit governance.
3. Operator-first controls (moderation/audit/policy/observability) instead of broad consumer feature race.

## Strategic Paths (Mutually Exclusive Defaults)

1. Direct Discord-alternative race:
   - Highest upside, highest execution risk from current baseline.
2. Operator-first EU community infrastructure:
   - Narrower market, stronger differentiation and defensibility.
3. API-first community backend platform:
   - Less consumer-brand upside, faster route to monetizable technical value.

## Recommendation for Next Planning Session

Choose one primary strategic path for the next 90 days and define explicit kill criteria and weekly checkpoints. Avoid running all three simultaneously.
