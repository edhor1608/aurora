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
  it("supports create community -> channel -> send/list message", () => {
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

    const session = createSession({
      userId: "member-1",
      ttlSeconds: 60,
      now: 1000,
    });

    const message = sendMessage(state, {
      session,
      now: 1500,
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

  it("rejects expired sessions", () => {
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

    const session = createSession({
      userId: "owner-1",
      ttlSeconds: 1,
      now: 1000,
    });

    expect(() =>
      sendMessage(state, {
        session,
        now: 2000,
        channelId: "ch-1",
        content: "late message",
      }),
    ).toThrowError("AUTH_SESSION_EXPIRED");
  });

  it("rejects users without community membership", () => {
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

    const session = createSession({
      userId: "outsider-1",
      ttlSeconds: 60,
      now: 1000,
    });

    expect(() =>
      sendMessage(state, {
        session,
        now: 1200,
        channelId: "ch-1",
        content: "unauthorized",
      }),
    ).toThrowError("AUTH_FORBIDDEN");
  });

  it("enforces channel-level send permission overrides", () => {
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

    const session = createSession({
      userId: "member-1",
      ttlSeconds: 60,
      now: 1000,
    });

    expect(() =>
      sendMessage(state, {
        session,
        now: 1200,
        channelId: "ch-1",
        content: "blocked",
      }),
    ).toThrowError("PERMISSION_DENIED");
  });
});
