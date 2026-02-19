import { describe, expect, it } from "vitest";
import { API_VERSION, SDK_CAPABILITIES, supportsCapability } from "../../packages/sdk/src/index";

describe("sdk contract", () => {
  it("pins API version to v1", () => {
    expect(API_VERSION).toBe("v1");
  });

  it("exposes required parity capabilities", () => {
    expect(SDK_CAPABILITIES).toContain("messages.write");
    expect(SDK_CAPABILITIES).toContain("voice.presence");
  });

  it("guards unknown capabilities", () => {
    expect(supportsCapability("channels.read")).toBe(true);
    expect(supportsCapability("admin.superuser")).toBe(false);
  });
});
