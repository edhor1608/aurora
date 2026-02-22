import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("web app follows TanStack Start + Better Auth + Convex architecture", () => {
  it("declares official TanStack Start + Convex query integration dependencies", () => {
    const packageJson = JSON.parse(read("apps/web/package.json")) as {
      dependencies?: Record<string, string>;
    };
    const deps = packageJson.dependencies ?? {};

    expect(deps["@tanstack/react-start"]).toBeDefined();
    expect(deps["@tanstack/react-query"]).toBeDefined();
    expect(deps["@tanstack/react-router-with-query"]).toBeDefined();
    expect(deps["@convex-dev/better-auth"]).toBeDefined();
    expect(deps["@convex-dev/react-query"]).toBeDefined();
    expect(deps["better-auth"]).toBeDefined();
    expect(deps["convex"]).toBeDefined();
  });

  it("uses TanStack Start vite plugin", () => {
    const viteConfig = read("apps/web/vite.config.ts");

    expect(viteConfig).toContain("tanstackStart(");
  });

  it("provides react-start auth bridge and auth route handler", () => {
    const authServer = read("apps/web/src/lib/auth-server.ts");
    const authRoute = read("apps/web/src/routes/api/auth.$.ts");

    expect(authServer).toContain("convexBetterAuthReactStart");
    expect(authServer).toContain("getToken");
    expect(authServer).toContain("fetchAuthQuery");
    expect(authRoute).toContain("createFileRoute");
    expect(authRoute).toContain("server:");
    expect(authRoute).toContain("handlers");
    expect(authRoute).toContain('"/api/auth/$"');
    expect(authRoute).toContain("handler(request)");
  });

  it("uses root route context + beforeLoad auth prefetch", () => {
    const rootRoute = read("apps/web/src/routes/__root.tsx");

    expect(rootRoute).toContain("createRootRouteWithContext");
    expect(rootRoute).toContain("beforeLoad");
    expect(rootRoute).toContain("getToken()");
    expect(rootRoute).toContain("fetchAuthQuery");
    expect(rootRoute).toContain("api.auth.getCurrentUser");
    expect(rootRoute).toContain("AppRouterContext");
  });

  it("uses routerWithQueryClient + ConvexQueryClient + ConvexBetterAuthProvider in router setup", () => {
    const router = read("apps/web/src/router.tsx");
    const authClient = read("apps/web/src/lib/auth-client.ts");

    expect(router).toContain("routerWithQueryClient");
    expect(router).toContain("ConvexQueryClient");
    expect(router).toContain("expectAuth");
    expect(router).toContain("ConvexBetterAuthProvider");
    expect(router).toContain("defaultPreloadStaleTime");
    expect(authClient).toContain("createAuthClient");
    expect(authClient).toContain("convexClient()");
  });
});
