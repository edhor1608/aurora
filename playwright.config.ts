import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  reporter: [["list"], ["html", { open: "never" }]],
  testDir: "./tests/e2e/playwright",
  timeout: 60_000,
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "cd apps/web && bun run dev",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: baseURL,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
