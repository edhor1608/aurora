import { env } from "@/lib/env";
import type { AppRouterContext } from "@/lib/router-context";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, notifyManager } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  if (typeof document !== "undefined") {
    notifyManager.setScheduler(window.requestAnimationFrame);
  }

  const convexQueryClient = new ConvexQueryClient(env.VITE_CONVEX_URL, {
    expectAuth: true,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: convexQueryClient.queryFn(),
        queryKeyHashFn: convexQueryClient.hashFn(),
      },
    },
  });

  convexQueryClient.connect(queryClient);

  const router = createTanStackRouter({
    context: { queryClient, convexQueryClient } satisfies AppRouterContext,
    defaultPreload: "intent",
    routeTree,
    scrollRestoration: true,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
