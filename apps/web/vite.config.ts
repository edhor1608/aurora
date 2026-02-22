import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  build: {
    rollupOptions: {
      external: ["node:async_hooks", "node:stream", "node:stream/web", "stream", "async_hooks"],
    },
  },
  envDir: "../../",
  optimizeDeps: {
    exclude: ["@resvg/resvg-js", "satori"],
  },
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  ssr: {
    external: ["@resvg/resvg-js"],
  },
});

export default config;
