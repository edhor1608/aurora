import { type GenericCtx, createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  const siteUrl = process.env.SITE_URL;
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!siteUrl) {
    throw new Error("SITE_URL must be set in Convex deployment environment");
  }

  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET must be set in Convex deployment environment");
  }

  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    secret,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [convex({ authConfig })],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
