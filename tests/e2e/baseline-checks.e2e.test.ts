import { execSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const run = (command: string) => {
  return execSync(command, {
    encoding: "utf8",
    stdio: "pipe",
  });
};

describe("baseline commands", () => {
  it(
    "runs typecheck, lint, workspace tests, and smoke tests",
    { timeout: 60_000 },
    () => {
      const typecheck = run("bun run typecheck");
      const lint = run("bun run lint");
      const workspaceTests = run("bun run test:workspaces");
      const smoke = run("bun run test:smoke");

      expect(typecheck).toContain("typecheck");
      expect(lint).toContain("lint");
      expect(workspaceTests).toContain("test");
      expect(smoke).toContain("test:smoke");
    },
  );
});
