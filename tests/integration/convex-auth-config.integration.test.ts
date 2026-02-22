import { describe, expect, it } from "vitest";
import authConfig from "../../convex/auth.config";

describe("convex auth config provider", () => {
  it("exports a provider factory for convex auth config", () => {
    expect(authConfig.providers.length).toBeGreaterThan(0);
    expect(authConfig.providers[0].type).toBe("customJwt");
    expect(typeof authConfig.providers[0].issuer).toBe("string");
  });
});
