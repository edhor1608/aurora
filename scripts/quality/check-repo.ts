import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

type Rule = {
  name: string;
  test: (path: string, source: string) => boolean;
};

const root = process.cwd();
const ignoredDirs = new Set([
  ".git",
  ".turbo",
  ".codex",
  "node_modules",
  "playwright-report",
  "test-results",
]);
const ignoredPathParts = [
  "/convex/_generated/",
  "/apps/web/src/routeTree.gen.ts/",
  "/scripts/quality/check-repo.ts/",
];
const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md"]);
const policyMentionAllowlist = new Set([
  "AGENTS.md",
  "docs/plans/repo-refresh-audit-2026-05-01.md",
]);

const normalizePath = (path: string) => path.replace(/\\/g, "/").replace(/^\.\//, "");

const getExtension = (path: string) => {
  const match = /\.[^.]+$/.exec(path);
  return match?.[0] ?? "";
};

const isIgnoredPath = (path: string) => {
  const normalized = `/${normalizePath(path)}/`;
  return ignoredPathParts.some((part) => normalized.includes(part));
};

const isProductionCode = (path: string) => {
  const normalized = normalizePath(path);

  return (
    /\.(ts|tsx)$/.test(normalized) &&
    !normalized.startsWith("tests/") &&
    !normalized.startsWith("scripts/") &&
    !normalized.includes(".test.") &&
    !normalized.includes(".spec.") &&
    !isIgnoredPath(normalized)
  );
};

const hasAnyType = (path: string, source: string) => {
  const scriptKind = path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, scriptKind);
  let found = false;

  const visit = (node: ts.Node) => {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return found;
};

const rules: Rule[] = [
  {
    name: "Do not use any outside generated files",
    test: (path, source) => isProductionCode(path) && hasAnyType(path, source),
  },
  {
    name: "Do not use @ts-ignore",
    test: (path, source) => /\.(ts|tsx)$/.test(path) && source.includes("@ts-ignore"),
  },
  {
    name: "Do not leave empty catch blocks",
    test: (path, source) =>
      /\.(ts|tsx)$/.test(path) && /catch\s*(?:\([^)]*\))?\s*\{\s*\}/.test(source),
  },
  {
    name: "Do not log from production code",
    test: (path, source) => isProductionCode(path) && source.includes("console.log"),
  },
  {
    name: "Do not use passWithNoTests",
    test: (path, source) => !policyMentionAllowlist.has(path) && source.includes("passWithNoTests"),
  },
  {
    name: "Do not keep placeholder smoke tests",
    test: (path, source) => !policyMentionAllowlist.has(path) && source.includes("smoke ok"),
  },
  {
    name: "Do not add forbidden package-manager docs",
    test: (path, source) =>
      normalizePath(path).endsWith(".md") &&
      !policyMentionAllowlist.has(normalizePath(path)) &&
      /(^|[^a-z])(?:npm|yarn|npx)([^a-z]|$)/i.test(source),
  },
  {
    name: "Do not keep starter boilerplate text",
    test: (_path, source) =>
      source.includes("Open up App.tsx") ||
      source.includes("Welcome to your Convex functions directory"),
  },
];

const walk = (dir: string): string[] => {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry)) continue;

    const absolute = join(dir, entry);
    const stats = statSync(absolute);

    if (stats.isDirectory()) {
      files.push(...walk(absolute));
      continue;
    }

    const path = normalizePath(relative(root, absolute));
    if (textExtensions.has(getExtension(path)) && !isIgnoredPath(path)) {
      files.push(path);
    }
  }

  return files;
};

const failures = walk(root).flatMap((path) => {
  const source = readFileSync(join(root, path), "utf8");
  return rules.filter((rule) => rule.test(path, source)).map((rule) => `${path}: ${rule.name}`);
});

if (failures.length > 0) {
  console.error(
    ["Repo quality check failed:", ...failures.map((failure) => `- ${failure}`)].join("\n"),
  );
  process.exit(1);
}

console.log("Repo quality check passed");
