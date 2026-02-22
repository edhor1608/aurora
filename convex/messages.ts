import { ConvexError, v } from "convex/values";
import {
  type MutationCtx,
  type QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { DEFAULT_CHANNEL_SLUG, DEFAULT_COMMUNITY_SLUG, DEFAULT_THREAD_SLUG } from "./schema";

const communityName = "Aurora";
const channelName = "General";
const threadTitle = "Hello World";

const ensureDefaultSpaceInMutation = async (ctx: MutationCtx) => {
  const now = Date.now();
  let community = await ctx.db
    .query("communities")
    .withIndex("by_slug", (q) => q.eq("slug", DEFAULT_COMMUNITY_SLUG))
    .unique();

  if (!community) {
    const communityId = await ctx.db.insert("communities", {
      slug: DEFAULT_COMMUNITY_SLUG,
      name: communityName,
      createdAt: now,
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
      slug: DEFAULT_CHANNEL_SLUG,
      name: channelName,
      createdAt: now,
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
      slug: DEFAULT_THREAD_SLUG,
      title: threadTitle,
      createdAt: now,
    });
    thread = await ctx.db.get(threadId);
  }

  if (!thread) {
    throw new ConvexError("Failed to create default thread");
  }

  return {
    communityId: community._id,
    channelId: channel._id,
    threadId: thread._id,
  };
};

const getDefaultSpaceInQuery = async (ctx: QueryCtx) => {
  const community = await ctx.db
    .query("communities")
    .withIndex("by_slug", (q) => q.eq("slug", DEFAULT_COMMUNITY_SLUG))
    .unique();

  if (!community) {
    return null;
  }

  const channel = await ctx.db
    .query("channels")
    .withIndex("by_community_id_and_slug", (q) =>
      q.eq("communityId", community._id).eq("slug", DEFAULT_CHANNEL_SLUG),
    )
    .unique();

  if (!channel) {
    return null;
  }

  const thread = await ctx.db
    .query("threads")
    .withIndex("by_channel_id_and_slug", (q) =>
      q.eq("channelId", channel._id).eq("slug", DEFAULT_THREAD_SLUG),
    )
    .unique();

  if (!thread) {
    return null;
  }

  return {
    communityId: community._id,
    channelId: channel._id,
    threadId: thread._id,
  };
};

export const ensureDefaultSpace = mutation({
  args: {},
  returns: v.object({
    communityId: v.id("communities"),
    channelId: v.id("channels"),
    threadId: v.id("threads"),
  }),
  handler: async (ctx) => {
    return await ensureDefaultSpaceInMutation(ctx);
  },
});

export const createMessage = internalMutation({
  args: {
    authorId: v.string(),
    body: v.string(),
  },
  returns: v.object({
    messageId: v.id("messages"),
    communityId: v.id("communities"),
    channelId: v.id("channels"),
    threadId: v.id("threads"),
    authorId: v.string(),
    body: v.string(),
    createdAt: v.number(),
  }),
  handler: async (ctx, args) => {
    const normalizedBody = args.body.trim();

    if (!normalizedBody) {
      throw new ConvexError("Message body cannot be empty");
    }

    const space = await ensureDefaultSpaceInMutation(ctx);
    const createdAt = Date.now();
    const messageId = await ctx.db.insert("messages", {
      communityId: space.communityId,
      channelId: space.channelId,
      threadId: space.threadId,
      authorId: args.authorId,
      body: normalizedBody,
      createdAt,
    });

    return {
      messageId,
      communityId: space.communityId,
      channelId: space.channelId,
      threadId: space.threadId,
      authorId: args.authorId,
      body: normalizedBody,
      createdAt,
    };
  },
});

export const listMessages = query({
  args: {},
  returns: v.array(
    v.object({
      messageId: v.id("messages"),
      communityId: v.id("communities"),
      channelId: v.id("channels"),
      threadId: v.id("threads"),
      authorId: v.string(),
      body: v.string(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const space = await getDefaultSpaceInQuery(ctx);

    if (!space) {
      return [];
    }

    const records = await ctx.db
      .query("messages")
      .withIndex("by_thread_id_and_created_at", (q) => q.eq("threadId", space.threadId))
      .order("desc")
      .take(50);

    records.reverse();

    return records.map((record) => ({
      messageId: record._id,
      communityId: record.communityId,
      channelId: record.channelId,
      threadId: record.threadId,
      authorId: record.authorId,
      body: record.body,
      createdAt: record.createdAt,
    }));
  },
});
