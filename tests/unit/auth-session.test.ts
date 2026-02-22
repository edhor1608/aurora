import { describe, expect, it } from "vitest";
import {
  assertActiveSession,
  createSession,
  isSessionActive,
} from "../../packages/core/src/auth";

describe("auth session", () => {
  it("creates a session with a deterministic expiry", () => {
    const session = createSession({
      userId: "u-1",
      ttlSeconds: 300,
      now: 1_700_000_000_000,
    });

    expect(session).toEqual({
      userId: "u-1",
      issuedAt: 1_700_000_000_000,
      expiresAt: 1_700_000_300_000,
    });
  });

  it("returns true only while session is active", () => {
    const session = createSession({
      userId: "u-1",
      ttlSeconds: 10,
      now: 10_000,
    });

    expect(isSessionActive(session, 19_999)).toBe(true);
    expect(isSessionActive(session, 20_000)).toBe(false);
  });

  it("throws for expired sessions", () => {
    const session = createSession({
      userId: "u-1",
      ttlSeconds: 1,
      now: 10_000,
    });

    expect(() => assertActiveSession(session, 11_000)).toThrowError(
      "AUTH_SESSION_EXPIRED",
    );
  });
});
