import { type GenericCtx, createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

const DEV_AUTH_SECRET = "aurora-dev-auth-secret-please-replace-in-prod-32+";

const resolveTrustedOrigins = (): string[] => {
  const defaults = ["http://localhost:3000", "http://127.0.0.1:3000"];
  const fromEnv = [process.env.SITE_URL, process.env.WEB_URL, process.env.CONVEX_SITE_URL].filter(
    (value): value is string => Boolean(value),
  );

  return Array.from(new Set([...defaults, ...fromEnv]));
};

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    database: authComponent.adapter(ctx),
    secret: process.env.BETTER_AUTH_SECRET ?? DEV_AUTH_SECRET,
    baseURL: process.env.CONVEX_SITE_URL,
    basePath: "/api/auth",
    trustedOrigins: resolveTrustedOrigins(),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      convex({
        authConfig,
      }),
    ],
  });
};
