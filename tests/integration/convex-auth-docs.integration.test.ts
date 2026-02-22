import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as messages from "../../convex/messages";

const read = (path: string) => readFileSync(path, "utf8");

describe("convex auth and message flow follows official Better Auth integration", () => {
  it("uses better-auth minimal runtime with typed env module and no fallback dev secret", () => {
    const authSource = read("convex/auth.ts");

    expect(authSource).toContain('from "better-auth/minimal"');
    expect(authSource).toContain('from "./env"');
    expect(authSource).toContain("env.SITE_URL");
    expect(authSource).not.toContain("DEV_AUTH_SECRET");
  });

  it("registers Better Auth routes in http router and avoids custom /api/messages wrappers", () => {
    const httpSource = read("convex/http.ts");

    expect(httpSource).toContain("registerRoutes");
    expect(httpSource).not.toContain('"/api/messages"');
  });

  it("exports public query/mutation for hello-world messaging", () => {
    expect(typeof messages.listMessages).toBe("function");
    expect(typeof messages.sendMessage).toBe("function");
  });

  it("guards message writes by authenticated Better Auth user", () => {
    const messageSource = read("convex/messages.ts");

    expect(messageSource).toContain("authComponent.getAuthUser");
  });
});
