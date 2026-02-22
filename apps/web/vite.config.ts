import { devtools } from "@tanstack/devtools-vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../../", "");
  const convexSiteUrl = env.CONVEX_SITE_URL;

  return {
    envDir: "../../",
    envPrefix: ["VITE_", "CONVEX_"],
    plugins: [
      devtools(),
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      viteReact(),
    ],
    server: convexSiteUrl
      ? {
          proxy: {
            "/api/auth": {
              target: convexSiteUrl,
              changeOrigin: true,
              secure: true,
            },
            "/api/messages": {
              target: convexSiteUrl,
              changeOrigin: true,
              secure: true,
            },
          },
        }
      : undefined,
  };
});

export default config;
