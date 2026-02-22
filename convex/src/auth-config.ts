import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";

export const authConfigProvider = getAuthConfigProvider();

export const convexAuthConfig = {
  providers: [authConfigProvider],
} satisfies AuthConfig;
