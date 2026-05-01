import { spawnSync } from "node:child_process";

const requiredEnv = [
  "VITE_CONVEX_URL",
  "VITE_CONVEX_SITE_URL",
  "SITE_URL",
  "BETTER_AUTH_SECRET",
] as const;
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.log(`Skipping browser e2e; missing env: ${missing.join(", ")}`);
  process.exit(0);
}

const result = spawnSync("bun", ["run", "test:e2e:browser"], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
