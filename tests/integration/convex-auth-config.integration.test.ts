import { describe, expect, it } from "vitest";
import { authConfigProvider } from "../../convex/src/auth-config";

describe("convex auth config provider", () => {
  it("exports a provider factory for convex auth config", () => {
    expect(authConfigProvider).toBeTruthy();
    expect(authConfigProvider.type).toBe("customJwt");
    expect(typeof authConfigProvider.issuer).toBe("string");
  });
});
