import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";
import type { AppRouterContext } from "@/lib/router-context";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import type { ReactNode } from "react";
import { routeTree } from "./routeTree.gen";

const createRouterContext = (queryClient: QueryClient): AppRouterContext => {
  return {
    queryClient,
    session: null,
  };
};

const WrapWithAuthProvider = ({
  children,
  convexQueryClient,
}: {
  children: ReactNode;
  convexQueryClient: ConvexQueryClient;
}) => {
  return (
    <ConvexBetterAuthProvider authClient={authClient} client={convexQueryClient.convexClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
};

export function getRouter() {
  const convexQueryClient = new ConvexQueryClient(env.VITE_CONVEX_URL, {
    expectAuth: true,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 5_000,
        queryFn: convexQueryClient.queryFn(),
        queryKeyHashFn: convexQueryClient.hashFn(),
      },
    },
  });

  convexQueryClient.connect(queryClient);

  return routerWithQueryClient(
    createRouter({
      context: createRouterContext(queryClient),
      defaultPreload: "intent",
      defaultPreloadStaleTime: 0,
      routeTree,
      scrollRestoration: true,
      Wrap: ({ children }: { children: ReactNode }) => {
        return (
          <WrapWithAuthProvider convexQueryClient={convexQueryClient}>
            {children}
          </WrapWithAuthProvider>
        );
      },
    }),
    queryClient,
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
