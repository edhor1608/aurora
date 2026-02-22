import type { QueryClient } from "@tanstack/react-query";
import type { FunctionReturnType } from "convex/server";
import type { api } from "../../../../convex/_generated/api";

export type AuthSession = FunctionReturnType<typeof api.auth.getCurrentUser> | null;

export type AppRouterContext = {
  queryClient: QueryClient;
  session: AuthSession;
};
