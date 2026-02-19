import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const run = (command: string, args: string[]) => {
  return spawnSync(command, args, {
    encoding: "utf8",
    timeout: 60_000,
    stdio: "pipe"
  });
};

describe("baseline commands", () => {
  it(
    "runs typecheck, lint, workspace tests, and smoke tests",
    { timeout: 60_000 },
    () => {
      const typecheck = run("bun", ["run", "typecheck"]);
      const lint = run("bun", ["run", "lint"]);
      const workspaceTests = run("bun", ["run", "test:workspaces"]);
      const smoke = run("bun", ["run", "test:smoke"]);

      expect(typecheck.status).toBe(0);
      expect(lint.status).toBe(0);
      expect(workspaceTests.status).toBe(0);
      expect(smoke.status).toBe(0);
    }
  );
});
