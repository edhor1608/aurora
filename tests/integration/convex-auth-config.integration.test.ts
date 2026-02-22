import { describe, expect, it } from "vitest";
import authConfig from "../../convex/auth.config";

describe("convex auth config provider", () => {
  it("exports a non-empty auth config (smoke test)", () => {
    expect(Array.isArray(authConfig.providers)).toBe(true);
    expect(authConfig.providers.length).toBeGreaterThan(0);
    const provider = authConfig.providers[0];
    expect(provider).toBeDefined();
    expect(provider.type).toBe("customJwt");
    expect(typeof provider.issuer).toBe("string");
  });
});
