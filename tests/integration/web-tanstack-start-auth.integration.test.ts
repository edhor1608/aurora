import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("web app follows TanStack Start + Better Auth + Convex architecture", () => {
  it("declares TanStack Start and Convex Better Auth integration dependencies", () => {
    const packageJson = JSON.parse(read("apps/web/package.json")) as {
      dependencies?: Record<string, string>;
    };
    const deps = packageJson.dependencies ?? {};

    expect(deps["@tanstack/react-start"]).toBeDefined();
    expect(deps["@convex-dev/better-auth"]).toBeDefined();
    expect(deps["better-auth"]).toBeDefined();
    expect(deps["convex"]).toBeDefined();
  });

  it("uses TanStack Start vite plugin and ssr noExternal for @convex-dev/better-auth", () => {
    const viteConfig = read("apps/web/vite.config.ts");

    expect(viteConfig).toContain("tanstackStart(");
    expect(viteConfig).toContain("noExternal");
    expect(viteConfig).toContain("@convex-dev/better-auth");
  });

  it("provides react-start auth bridge and auth route handler", () => {
    const authServer = read("apps/web/src/lib/auth-server.ts");
    const authRoute = read("apps/web/src/routes/api/auth.$.ts");

    expect(authServer).toContain("convexBetterAuthReactStart");
    expect(authRoute).toContain("createFileRoute");
    expect(authRoute).toContain("server:");
    expect(authRoute).toContain("handlers");
    expect(authRoute).toContain('"/api/auth/$"');
    expect(authRoute).toContain("handler(request)");
  });

  it("uses ConvexBetterAuthProvider and convexClient plugin in the client", () => {
    const provider = read("apps/web/src/integrations/convex/provider.tsx");
    const authClient = read("apps/web/src/lib/auth-client.ts");

    expect(provider).toContain("ConvexBetterAuthProvider");
    expect(authClient).toContain("createAuthClient");
    expect(authClient).toContain("convexClient()");
  });
});
