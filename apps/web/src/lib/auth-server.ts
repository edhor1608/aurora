import { env } from "@/lib/env";
import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";

const convexUrl = env.VITE_CONVEX_URL;
const convexSiteUrl = env.VITE_CONVEX_SITE_URL;

export const { handler, fetchAuthAction, fetchAuthMutation, fetchAuthQuery, getToken } =
  convexBetterAuthReactStart({
    convexUrl,
    convexSiteUrl,
  });
