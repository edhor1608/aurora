import { tableNames } from "./schema";

export const convexBootstrap = {
  module: "convex",
  tables: tableNames,
} as const;
