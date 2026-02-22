import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("typed env handling", () => {
  it("declares t3 env dependencies for web and convex packages", () => {
    const webPackageJson = JSON.parse(read("apps/web/package.json")) as {
      dependencies?: Record<string, string>;
    };
    const convexPackageJson = JSON.parse(read("convex/package.json")) as {
      dependencies?: Record<string, string>;
    };

    expect(webPackageJson.dependencies?.["@t3-oss/env-core"]).toBeDefined();
    expect(webPackageJson.dependencies?.zod).toBeDefined();
    expect(convexPackageJson.dependencies?.["@t3-oss/env-core"]).toBeDefined();
    expect(convexPackageJson.dependencies?.zod).toBeDefined();
  });

  it("centralizes web env parsing in apps/web/src/lib/env.ts", () => {
    const source = read("apps/web/src/lib/env.ts");

    expect(source).toContain("createEnv");
    expect(source).toContain("clientPrefix");
    expect(source).toContain("runtimeEnvStrict");
    expect(source).toContain("VITE_CONVEX_URL");
    expect(source).toContain("VITE_CONVEX_SITE_URL");
  });

  it("centralizes convex env parsing in convex/env.ts", () => {
    const source = read("convex/env.ts");

    expect(source).toContain("createEnv");
    expect(source).toContain("runtimeEnvStrict");
    expect(source).toContain("SITE_URL");
    expect(source).toContain("BETTER_AUTH_SECRET");
  });

  it("uses env modules instead of ad hoc process/import env lookups", () => {
    const authServer = read("apps/web/src/lib/auth-server.ts");
    const router = read("apps/web/src/router.tsx");
    const convexAuth = read("convex/auth.ts");

    expect(authServer).toContain('from "@/lib/env"');
    expect(router).toContain('from "@/lib/env"');
    expect(convexAuth).toContain('from "./env"');

    expect(authServer).not.toContain("import.meta.env");
    expect(authServer).not.toContain("process.env");
    expect(router).not.toContain("import.meta.env");
    expect(router).not.toContain("process.env");
    expect(convexAuth).not.toContain("process.env");
  });
});
