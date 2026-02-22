import { type GenericCtx, createClient } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { type BetterAuthOptions, betterAuth } from "better-auth/minimal";
import type { AuthConfig } from "convex/server";

export type ConvexBetterAuthInput = {
  siteUrl: string;
  secret: string;
  component: unknown;
  ctx: GenericCtx;
  authConfig: AuthConfig;
  enableCrossDomain?: boolean;
  options?: Partial<BetterAuthOptions>;
};

type BetterAuthFactory = (options: BetterAuthOptions) => ReturnType<typeof betterAuth>;

type BetterAuthPlugin = NonNullable<BetterAuthOptions["plugins"]>[number];

type BuildDeps = {
  createAdapter: (component: unknown, ctx: GenericCtx) => BetterAuthOptions["database"];
  createConvexPlugin: (authConfig: AuthConfig) => BetterAuthPlugin;
  createCrossDomainPlugin: (siteUrl: string) => BetterAuthPlugin;
};

type CreateDeps = BuildDeps & {
  betterAuth: BetterAuthFactory;
};

const defaultDeps: CreateDeps = {
  betterAuth,
  createAdapter: (component, ctx) => createClient(component as never).adapter(ctx),
  createConvexPlugin: (authConfig) => convex({ authConfig }),
  createCrossDomainPlugin: (siteUrl) => crossDomain({ siteUrl }),
};

export const buildBetterAuthOptions = (
  input: ConvexBetterAuthInput,
  deps: BuildDeps = defaultDeps,
): BetterAuthOptions => {
  const basePlugins: BetterAuthPlugin[] = [deps.createConvexPlugin(input.authConfig)];

  if (input.enableCrossDomain) {
    basePlugins.push(deps.createCrossDomainPlugin(input.siteUrl));
  }

  return {
    baseURL: input.siteUrl,
    basePath: "/api/auth",
    secret: input.secret,
    trustedOrigins: [input.siteUrl],
    database: deps.createAdapter(input.component, input.ctx),
    emailAndPassword: { enabled: true },
    ...input.options,
    plugins: input.options?.plugins ?? basePlugins,
  };
};

export const createConvexBetterAuth = (
  input: ConvexBetterAuthInput,
  deps: CreateDeps = defaultDeps,
): ReturnType<typeof betterAuth> => {
  return deps.betterAuth(
    buildBetterAuthOptions(input, {
      createAdapter: deps.createAdapter,
      createConvexPlugin: deps.createConvexPlugin,
      createCrossDomainPlugin: deps.createCrossDomainPlugin,
    }),
  );
};
