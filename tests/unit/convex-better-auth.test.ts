import { describe, expect, it } from "vitest";
import authConfig from "../../convex/auth.config";
import { authComponent, createAuth } from "../../convex/auth";
import {
  DEFAULT_CHANNEL_SLUG,
  DEFAULT_COMMUNITY_SLUG,
  DEFAULT_THREAD_SLUG,
} from "../../convex/schema";

describe("convex better-auth runtime wiring", () => {
  it("exports at least one auth provider", () => {
    expect(authConfig.providers.length).toBeGreaterThan(0);
  });

  it("exports default hierarchy slugs for community/channel/thread", () => {
    expect(DEFAULT_COMMUNITY_SLUG).toBe("aurora");
    expect(DEFAULT_CHANNEL_SLUG).toBe("general");
    expect(DEFAULT_THREAD_SLUG).toBe("hello-world");
  });

  it("exposes auth factory and component client hooks", () => {
    expect(typeof createAuth).toBe("function");
    expect(typeof authComponent.registerRoutes).toBe("function");
  });
});
