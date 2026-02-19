import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("docs mirror", () => {
  it("keeps locked decisions and architecture docs stable", () => {
    const decisions = readFileSync("docs/decisions.md", "utf8");
    const architecture = readFileSync("docs/architecture.md", "utf8");

    expect(decisions).toContain("D-101");
    expect(decisions).toContain("D-107");
    expect(decisions).toContain("25 concurrent users");
    expect(decisions).toContain("Docker Compose only");
    expect(decisions).toContain("Temporary fallback note");
    expect(architecture).toContain("LiveKit Cloud EU");

    expect({ decisions, architecture }).toMatchSnapshot();
  });
});
