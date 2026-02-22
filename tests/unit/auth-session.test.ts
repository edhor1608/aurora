import { describe, expect, it } from "vitest";
import {
  assertActiveSession,
  createSession,
  isSessionActive,
} from "../../packages/core/src/auth";

describe("auth session", () => {
  it("creates a better-auth backed session for the requested user", async () => {
    const session = await createSession({
      userId: "u-1",
      ttlSeconds: 300,
    });

    expect(session.userId).toBe("u-1");
    expect(session.provider).toBe("better-auth");
    expect(session.token.length).toBeGreaterThan(10);
    expect(session.expiresAt).toBeGreaterThan(session.issuedAt);
  });

  it("returns true only while session is active", async () => {
    const session = await createSession({
      userId: "u-1",
      ttlSeconds: 1,
    });

    expect(isSessionActive(session, session.expiresAt - 1)).toBe(true);
    expect(isSessionActive(session, session.expiresAt)).toBe(false);
  });

  it("throws for expired sessions", async () => {
    const session = await createSession({
      userId: "u-1",
      ttlSeconds: 1,
    });

    expect(() => assertActiveSession(session, session.expiresAt)).toThrowError(
      "AUTH_SESSION_EXPIRED",
    );
  });
});
