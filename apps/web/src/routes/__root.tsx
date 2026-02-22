/// <reference types="vite/client" />
import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/auth-server";
import type { AppRouterContext } from "@/lib/router-context";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return getToken();
});

export const Route = createRootRouteWithContext<AppRouterContext>()({
  beforeLoad: async ({ context }) => {
    const token = await getAuth();

    if (token) {
      context.convexQueryClient.serverHttpClient?.setAuth(token);
    }

    return {
      isAuthenticated: Boolean(token),
      token,
    };
  },
  component: RootComponent,
});

function RootComponent() {
  const context = Route.useRouteContext();
  return (
    <ConvexBetterAuthProvider
      authClient={authClient}
      client={context.convexQueryClient.convexClient}
      initialToken={context.token}
    >
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ConvexBetterAuthProvider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  const isDev = import.meta.env.DEV;

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link href={appCss} rel="stylesheet" />
      </head>
      <body>
        {children}
        {isDev ? (
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  );
}
