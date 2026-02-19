import { describe, expect, it } from "vitest";
import { resolveChannelPermission } from "../../packages/core/src/permissions";

describe("resolveChannelPermission", () => {
  it("denies when base role denies send_message", () => {
    const result = resolveChannelPermission({
      base: { send_message: false },
      overrides: [],
    });

    expect(result.send_message).toBe(false);
  });

  it("applies explicit allow override over base deny", () => {
    const result = resolveChannelPermission({
      base: { send_message: false },
      overrides: [{ send_message: true }],
    });

    expect(result.send_message).toBe(true);
  });

  it("keeps the last explicit override", () => {
    const result = resolveChannelPermission({
      base: { send_message: true },
      overrides: [{ send_message: false }, { send_message: true }],
    });

    expect(result.send_message).toBe(true);
  });
});
