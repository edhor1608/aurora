import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";

const convexUrl =
  import.meta.env.VITE_CONVEX_URL || process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
const convexSiteUrl =
  import.meta.env.VITE_CONVEX_SITE_URL ||
  process.env.VITE_CONVEX_SITE_URL ||
  process.env.CONVEX_SITE_URL;

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not set");
}

if (!convexSiteUrl) {
  throw new Error("VITE_CONVEX_SITE_URL is not set");
}

export const { handler, fetchAuthAction, fetchAuthMutation, fetchAuthQuery, getToken } =
  convexBetterAuthReactStart({
    convexUrl,
    convexSiteUrl,
  });
