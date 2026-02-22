import { tableNames } from "./schema";

export const convexBootstrap = {
  module: "convex",
  tables: tableNames,
  auth: {
    provider: "better-auth",
    integration: "@convex-dev/better-auth",
  },
} as const;

export * from "./auth-config";
export * from "./better-auth";
