import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  runtimeEnvStrict: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    SITE_URL: process.env.SITE_URL,
  },
  server: {
    BETTER_AUTH_SECRET: z.string().min(1),
    SITE_URL: z.string().url(),
  },
});
