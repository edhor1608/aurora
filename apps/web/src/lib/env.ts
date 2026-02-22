import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    VITE_CONVEX_SITE_URL: z.string().url(),
    VITE_CONVEX_URL: z.string().url(),
  },
  clientPrefix: "VITE_",
  runtimeEnvStrict: {
    VITE_CONVEX_SITE_URL: import.meta.env.VITE_CONVEX_SITE_URL,
    VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
  },
});
