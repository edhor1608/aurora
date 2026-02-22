import { describe, expect, it, vi } from "vitest";
import {
  buildBetterAuthOptions,
  createConvexBetterAuth,
} from "../../convex/src/better-auth";

describe("convex better-auth integration", () => {
  it("builds better-auth options from convex context", () => {
    const options = buildBetterAuthOptions(
      {
        siteUrl: "https://aurora.example.eu",
        secret: "super-secret-value-at-least-32-characters",
        component: { name: "betterAuthComponent" },
        ctx: { user: "ctx" },
        authConfig: { providers: [] },
      },
      {
        createAdapter: (component, ctx) => ({ component, ctx }),
        createConvexPlugin: () => ({ id: "convex-plugin" }) as never,
        createCrossDomainPlugin: () => ({ id: "cross-domain-plugin" }) as never,
      },
    );

    expect(options.baseURL).toBe("https://aurora.example.eu");
    expect(options.basePath).toBe("/api/auth");
    expect(options.secret).toBe("super-secret-value-at-least-32-characters");
    expect(options.trustedOrigins).toEqual(["https://aurora.example.eu"]);
    expect(options.database).toEqual({
      component: { name: "betterAuthComponent" },
      ctx: { user: "ctx" },
    });
    expect(options.plugins).toEqual([{ id: "convex-plugin" }]);
    expect(options.emailAndPassword).toEqual({ enabled: true });
  });

  it("delegates auth creation to better-auth initializer", () => {
    const betterAuthMock = vi.fn((options) => ({ options }));

    const result = createConvexBetterAuth(
      {
        siteUrl: "https://aurora.example.eu",
        secret: "super-secret-value-at-least-32-characters",
        component: "component-ref",
        ctx: "ctx-ref",
        authConfig: { providers: [] },
      },
      {
        betterAuth: betterAuthMock,
        createAdapter: (component, ctx) => ({ component, ctx }),
        createConvexPlugin: () => ({ id: "convex-plugin" }) as never,
        createCrossDomainPlugin: () => ({ id: "cross-domain-plugin" }) as never,
      },
    );

    expect(betterAuthMock).toHaveBeenCalledTimes(1);
    expect(result.options.database).toEqual({
      component: "component-ref",
      ctx: "ctx-ref",
    });
  });
});
