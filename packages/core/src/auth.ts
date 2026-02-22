import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";

const DEV_SESSION_PASSWORD = "aurora-dev-password-123";
const DEV_AUTH_BASE_URL = "http://localhost:3000";
const DEV_AUTH_SECRET = "aurora-dev-secret-value-at-least-32-chars";

export type Session = {
  userId: string;
  issuedAt: number;
  expiresAt: number;
  token: string;
  provider: "better-auth";
};

export type CreateSessionInput = {
  userId: string;
  ttlSeconds: number;
};

type AuthRuntimeConfig = {
  baseUrl: string;
  secret: string;
  sessionPassword: string;
};

const toTestEmail = (userId: string): string => {
  const localPart = userId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  return `${localPart || "user"}@aurora.test`;
};

const resolveAuthRuntimeConfig = (): AuthRuntimeConfig => {
  const isTest = process.env.NODE_ENV === "test";

  const sessionPassword =
    process.env.AURORA_SESSION_PASSWORD ?? (isTest ? DEV_SESSION_PASSWORD : "");
  const baseUrl = process.env.AURORA_AUTH_BASE_URL ?? (isTest ? DEV_AUTH_BASE_URL : "");
  const secret = process.env.AURORA_AUTH_SECRET ?? (isTest ? DEV_AUTH_SECRET : "");

  if (!sessionPassword || !baseUrl || !secret) {
    throw new Error("AUTH_CONFIG_MISSING");
  }

  return {
    baseUrl,
    secret,
    sessionPassword,
  };
};

const parseSessionCookie = (setCookieHeader: string | null): { name: string; token: string } => {
  if (!setCookieHeader) {
    throw new Error("AUTH_SESSION_CREATE_FAILED");
  }

  const match = setCookieHeader.match(/((?:__Secure-)?better-auth\.session_token)=([^;]+)/);

  if (!match) {
    throw new Error("AUTH_SESSION_CREATE_FAILED");
  }

  return {
    name: match[1],
    token: match[2],
  };
};

export const createSession = async (input: CreateSessionInput): Promise<Session> => {
  const config = resolveAuthRuntimeConfig();
  let requestedUserId = input.userId;

  const auth = betterAuth({
    baseURL: config.baseUrl,
    secret: config.secret,
    database: memoryAdapter({
      user: [],
      session: [],
      account: [],
      verification: [],
    }),
    emailAndPassword: { enabled: true },
    session: { expiresIn: input.ttlSeconds },
    advanced: {
      database: {
        generateId: ({ model }) => {
          if (model !== "user") {
            return false;
          }

          if (!requestedUserId) {
            return false;
          }

          const next = requestedUserId;
          requestedUserId = "";
          return next;
        },
      },
    },
  });

  const signUpResponse = await auth.api.signUpEmail({
    body: {
      email: toTestEmail(input.userId),
      password: config.sessionPassword,
      name: input.userId,
    },
    asResponse: true,
  });

  if (!signUpResponse.ok) {
    throw new Error("AUTH_SESSION_CREATE_FAILED");
  }

  const { name: cookieName, token } = parseSessionCookie(signUpResponse.headers.get("set-cookie"));
  const resolvedSession = await auth.api.getSession({
    headers: new Headers({
      cookie: `${cookieName}=${token}`,
    }),
  });

  if (!resolvedSession) {
    throw new Error("AUTH_SESSION_CREATE_FAILED");
  }

  return {
    userId: resolvedSession.session.userId,
    issuedAt: resolvedSession.session.createdAt.getTime(),
    expiresAt: resolvedSession.session.expiresAt.getTime(),
    token,
    provider: "better-auth",
  };
};

export const isSessionActive = (session: Session, now: number): boolean => {
  return now < session.expiresAt;
};

export const assertActiveSession = (session: Session, now: number): void => {
  if (!isSessionActive(session, now)) {
    throw new Error("AUTH_SESSION_EXPIRED");
  }
};
