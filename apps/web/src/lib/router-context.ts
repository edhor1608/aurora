import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";

export type AppRouterContext = {
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
};
