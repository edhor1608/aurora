import { ConvexError, v } from "convex/values";
import { type MutationCtx, type QueryCtx, mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { DEFAULT_CHANNEL_SLUG, DEFAULT_COMMUNITY_SLUG, DEFAULT_THREAD_SLUG } from "./schema";

const communityName = "Aurora";
const channelName = "General";
const threadTitle = "Hello World";
const MESSAGE_PAGE_SIZE = 50;

const ensureDefaultSpaceInMutation = async (ctx: MutationCtx) => {
  const now = Date.now();
  let community = await ctx.db
    .query("communities")
    .withIndex("by_slug", (q) => q.eq("slug", DEFAULT_COMMUNITY_SLUG))
    .unique();

  if (!community) {
    const communityId = await ctx.db.insert("communities", {
      createdAt: now,
      name: communityName,
      slug: DEFAULT_COMMUNITY_SLUG,
    });
    community = await ctx.db.get(communityId);
  }

  if (!community) {
    throw new ConvexError("Failed to create default community");
  }

  let channel = await ctx.db
    .query("channels")
    .withIndex("by_community_id_and_slug", (q) =>
      q.eq("communityId", community._id).eq("slug", DEFAULT_CHANNEL_SLUG),
    )
    .unique();

  if (!channel) {
    const channelId = await ctx.db.insert("channels", {
      communityId: community._id,
      createdAt: now,
      name: channelName,
      slug: DEFAULT_CHANNEL_SLUG,
    });
    channel = await ctx.db.get(channelId);
  }

  if (!channel) {
    throw new ConvexError("Failed to create default channel");
  }

  let thread = await ctx.db
    .query("threads")
    .withIndex("by_channel_id_and_slug", (q) =>
      q.eq("channelId", channel._id).eq("slug", DEFAULT_THREAD_SLUG),
    )
    .unique();

  if (!thread) {
    const threadId = await ctx.db.insert("threads", {
      channelId: channel._id,
      createdAt: now,
      slug: DEFAULT_THREAD_SLUG,
      title: threadTitle,
    });
    thread = await ctx.db.get(threadId);
  }

  if (!thread) {
    throw new ConvexError("Failed to create default thread");
  }

  return {
    channelId: channel._id,
    communityId: community._id,
    threadId: thread._id,
  };
};

const getDefaultSpaceInQuery = async (ctx: QueryCtx) => {
  const community = await ctx.db
    .query("communities")
    .withIndex("by_slug", (q) => q.eq("slug", DEFAULT_COMMUNITY_SLUG))
    .unique();
  if (!community) return null;

  const channel = await ctx.db
    .query("channels")
    .withIndex("by_community_id_and_slug", (q) =>
      q.eq("communityId", community._id).eq("slug", DEFAULT_CHANNEL_SLUG),
    )
    .unique();
  if (!channel) return null;

  const thread = await ctx.db
    .query("threads")
    .withIndex("by_channel_id_and_slug", (q) =>
      q.eq("channelId", channel._id).eq("slug", DEFAULT_THREAD_SLUG),
    )
    .unique();
  if (!thread) return null;

  return {
    channelId: channel._id,
    communityId: community._id,
    threadId: thread._id,
  };
};

export const ensureDefaultSpace = mutation({
  args: {},
  returns: v.object({
    channelId: v.id("channels"),
    communityId: v.id("communities"),
    threadId: v.id("threads"),
  }),
  handler: async (ctx) => {
    await authComponent.getAuthUser(ctx);
    return ensureDefaultSpaceInMutation(ctx);
  },
});

export const sendMessage = mutation({
  args: {
    body: v.string(),
  },
  returns: v.object({
    authorId: v.string(),
    body: v.string(),
    channelId: v.id("channels"),
    communityId: v.id("communities"),
    createdAt: v.number(),
    messageId: v.id("messages"),
    threadId: v.id("threads"),
  }),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const normalizedBody = args.body.trim();

    if (!normalizedBody) {
      throw new ConvexError("Message body cannot be empty");
    }

    const space = await ensureDefaultSpaceInMutation(ctx);
    const createdAt = Date.now();
    const messageId = await ctx.db.insert("messages", {
      authorId: user._id,
      body: normalizedBody,
      channelId: space.channelId,
      communityId: space.communityId,
      createdAt,
      threadId: space.threadId,
    });

    return {
      authorId: user._id,
      body: normalizedBody,
      channelId: space.channelId,
      communityId: space.communityId,
      createdAt,
      messageId,
      threadId: space.threadId,
    };
  },
});

export const listMessages = query({
  args: {},
  returns: v.array(
    v.object({
      authorId: v.string(),
      body: v.string(),
      channelId: v.id("channels"),
      communityId: v.id("communities"),
      createdAt: v.number(),
      messageId: v.id("messages"),
      threadId: v.id("threads"),
    }),
  ),
  handler: async (ctx) => {
    await authComponent.getAuthUser(ctx);
    const space = await getDefaultSpaceInQuery(ctx);
    if (!space) return [];

    const records = await ctx.db
      .query("messages")
      .withIndex("by_thread_id_and_created_at", (q) => q.eq("threadId", space.threadId))
      .order("desc")
      .take(MESSAGE_PAGE_SIZE);

    records.reverse();
    return records.map((record) => ({
      authorId: record.authorId,
      body: record.body,
      channelId: record.channelId,
      communityId: record.communityId,
      createdAt: record.createdAt,
      messageId: record._id,
      threadId: record.threadId,
    }));
  },
});
