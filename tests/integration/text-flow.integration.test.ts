import { describe, expect, it } from "vitest";
import { createSession } from "../../packages/core/src/auth";
import {
  addMember,
  createChannel,
  createCommunity,
  createCoreState,
  listMessages,
  sendMessage,
} from "../../packages/core/src/text-flow";

describe("text flow vertical slice", () => {
  it("supports create community -> channel -> send/list message", async () => {
    const state = createCoreState();

    createCommunity(state, {
      communityId: "c-1",
      name: "Aurora",
      ownerId: "owner-1",
    });

    addMember(state, {
      communityId: "c-1",
      userId: "member-1",
      role: "member",
    });

    createChannel(state, {
      channelId: "ch-1",
      communityId: "c-1",
      name: "general",
      overrides: [],
    });

    const session = await createSession({
      userId: "member-1",
      ttlSeconds: 60,
    });

    const message = sendMessage(state, {
      session,
      now: session.issuedAt + 500,
      channelId: "ch-1",
      content: "hello aurora",
    });

    expect(message).toEqual({
      id: "ch-1:1",
      channelId: "ch-1",
      authorId: "member-1",
      content: "hello aurora",
      sortKey: 1,
    });

    expect(listMessages(state, { channelId: "ch-1" })).toEqual([message]);
  });

  it("rejects expired sessions", async () => {
    const state = createCoreState();

    createCommunity(state, {
      communityId: "c-1",
      name: "Aurora",
      ownerId: "owner-1",
    });

    createChannel(state, {
      channelId: "ch-1",
      communityId: "c-1",
      name: "general",
      overrides: [],
    });

    const session = await createSession({
      userId: "owner-1",
      ttlSeconds: 1,
    });

    expect(() =>
      sendMessage(state, {
        session,
        now: session.expiresAt,
        channelId: "ch-1",
        content: "late message",
      }),
    ).toThrowError("AUTH_SESSION_EXPIRED");
  });

  it("rejects users without community membership", async () => {
    const state = createCoreState();

    createCommunity(state, {
      communityId: "c-1",
      name: "Aurora",
      ownerId: "owner-1",
    });

    createChannel(state, {
      channelId: "ch-1",
      communityId: "c-1",
      name: "general",
      overrides: [],
    });

    const session = await createSession({
      userId: "outsider-1",
      ttlSeconds: 60,
    });

    expect(() =>
      sendMessage(state, {
        session,
        now: session.issuedAt + 200,
        channelId: "ch-1",
        content: "unauthorized",
      }),
    ).toThrowError("AUTH_FORBIDDEN");
  });

  it("enforces channel-level send permission overrides", async () => {
    const state = createCoreState();

    createCommunity(state, {
      communityId: "c-1",
      name: "Aurora",
      ownerId: "owner-1",
    });

    addMember(state, {
      communityId: "c-1",
      userId: "member-1",
      role: "member",
    });

    createChannel(state, {
      channelId: "ch-1",
      communityId: "c-1",
      name: "announcements",
      overrides: [{ send_message: false }],
    });

    const session = await createSession({
      userId: "member-1",
      ttlSeconds: 60,
    });

    expect(() =>
      sendMessage(state, {
        session,
        now: session.issuedAt + 200,
        channelId: "ch-1",
        content: "blocked",
      }),
    ).toThrowError("PERMISSION_DENIED");
  });

  it("rejects duplicate community identifiers", () => {
    const state = createCoreState();

    createCommunity(state, {
      communityId: "c-1",
      name: "Aurora",
      ownerId: "owner-1",
    });

    expect(() =>
      createCommunity(state, {
        communityId: "c-1",
        name: "Aurora",
        ownerId: "owner-1",
      }),
    ).toThrowError("COMMUNITY_ALREADY_EXISTS");
  });
});
