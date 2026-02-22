import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const DEFAULT_COMMUNITY_SLUG = "aurora";
export const DEFAULT_CHANNEL_SLUG = "general";
export const DEFAULT_THREAD_SLUG = "hello-world";

export default defineSchema({
  communities: defineTable({
    slug: v.string(),
    name: v.string(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  channels: defineTable({
    communityId: v.id("communities"),
    slug: v.string(),
    name: v.string(),
    createdAt: v.number(),
  }).index("by_community_id_and_slug", ["communityId", "slug"]),

  threads: defineTable({
    channelId: v.id("channels"),
    slug: v.string(),
    title: v.string(),
    createdAt: v.number(),
  }).index("by_channel_id_and_slug", ["channelId", "slug"]),

  messages: defineTable({
    communityId: v.id("communities"),
    channelId: v.id("channels"),
    threadId: v.id("threads"),
    authorId: v.string(),
    body: v.string(),
    createdAt: v.number(),
  })
    .index("by_channel_id_and_created_at", ["channelId", "createdAt"])
    .index("by_thread_id_and_created_at", ["threadId", "createdAt"]),
});
