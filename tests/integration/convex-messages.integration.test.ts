/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import type { UserIdentity } from "convex/server";
import { describe, expect, it } from "vitest";
import { api, components } from "../../convex/_generated/api";
import { register as registerBetterAuth } from "../../convex/node_modules/@convex-dev/better-auth/src/test";
import schema from "../../convex/schema";

const modules = import.meta.glob("../../convex/**/*.ts");

const createTestBackend = () => {
  const t = convexTest(schema, modules);
  registerBetterAuth(t);
  return t;
};

const createAuthenticatedBackend = async () => {
  const t = createTestBackend();
  const now = Date.now();
  const user = await t.mutation(components.betterAuth.adapter.create, {
    input: {
      model: "user",
      data: {
        createdAt: now,
        email: "user-1@aurora.test",
        emailVerified: true,
        name: "User One",
        updatedAt: now,
      },
    },
  });
  const session = await t.mutation(components.betterAuth.adapter.create, {
    input: {
      model: "session",
      data: {
        createdAt: now,
        expiresAt: now + 60_000,
        token: "test-session-token",
        updatedAt: now,
        userId: user._id,
      },
    },
  });
  const identity: Partial<UserIdentity> & { sessionId: string } = {
    sessionId: session._id,
    subject: user._id,
  };

  return t.withIdentity(identity);
};

describe("convex message functions", () => {
  it("rejects unauthenticated message reads and writes", async () => {
    const t = createTestBackend();

    await expect(t.query(api.messages.listMessages, {})).rejects.toThrow();
    await expect(t.mutation(api.messages.sendMessage, { body: "hello" })).rejects.toThrow();
  });

  it("rejects empty authenticated messages", async () => {
    const t = await createAuthenticatedBackend();

    await expect(t.mutation(api.messages.sendMessage, { body: "   " })).rejects.toThrow(
      "Message body cannot be empty",
    );
  });

  it("persists trimmed messages in display order", async () => {
    const realDateNow = Date.now;
    let now = realDateNow();
    Date.now = () => now;

    try {
      const t = await createAuthenticatedBackend();
      now += 1_000;
      const first = await t.mutation(api.messages.sendMessage, { body: " first " });
      now += 1_000;
      const second = await t.mutation(api.messages.sendMessage, { body: "second" });
      const messages = await t.query(api.messages.listMessages, {});

      expect(first.body).toBe("first");
      expect(second.body).toBe("second");
      expect(messages.map((message) => message.body)).toEqual(["first", "second"]);
      expect(messages.map((message) => message.authorId)).toEqual([
        first.authorId,
        second.authorId,
      ]);
    } finally {
      Date.now = realDateNow;
    }
  });
});
