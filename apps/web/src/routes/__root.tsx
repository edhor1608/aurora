import { fetchAuthQuery, getToken } from "@/lib/auth-server";
import type { AppRouterContext } from "@/lib/router-context";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { api } from "../../../../convex/_generated/api";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<AppRouterContext>()({
  beforeLoad: async ({ context }) => {
    if (typeof document !== "undefined") {
      return {
        session: context.session,
      };
    }
    const token = await getToken();
    const session = token ? await fetchAuthQuery(api.auth.getCurrentUser, {}) : null;
    return {
      session,
    };
  },
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  return <Outlet />;
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
