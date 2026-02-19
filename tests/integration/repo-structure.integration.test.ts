import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const requiredPaths = [
  "apps/web",
  "apps/mobile",
  "convex",
  "packages/core",
  "packages/sdk",
  "packages/ui",
  "packages/config",
  "docs",
  "TRADEMARKS.md",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "turbo.json",
  "biome.json",
  ".nvmrc",
  ".github/workflows/ci.yml",
];

describe("repository scaffold", () => {
  it("contains required monorepo and governance paths", () => {
    for (const path of requiredPaths) {
      expect(existsSync(path), `missing ${path}`).toBe(true);
    }
  });

  it("pins node runtime to 22", () => {
    const nvmrc = readFileSync(".nvmrc", "utf8").trim();

    expect(nvmrc).toBe("22");
  });
});
