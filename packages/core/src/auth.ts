import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";

const SESSION_PASSWORD = "aurora-dev-password-123";
const AUTH_BASE_URL = "http://localhost:3000";
const AUTH_SECRET = "aurora-dev-secret-value-at-least-32-chars";

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

const toTestEmail = (userId: string): string => {
  const localPart = userId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  return `${localPart || "user"}@aurora.test`;
};

const parseSessionToken = (setCookieHeader: string | null): string => {
  if (!setCookieHeader) {
    throw new Error("AUTH_SESSION_CREATE_FAILED");
  }

  const match = setCookieHeader.match(/(?:__Secure-)?better-auth\.session_token=([^;]+)/);

  if (!match) {
    throw new Error("AUTH_SESSION_CREATE_FAILED");
  }

  return match[1];
};

export const createSession = async (input: CreateSessionInput): Promise<Session> => {
  let requestedUserId = input.userId;

  const auth = betterAuth({
    baseURL: AUTH_BASE_URL,
    secret: AUTH_SECRET,
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
      password: SESSION_PASSWORD,
      name: input.userId,
    },
    asResponse: true,
  });

  if (signUpResponse.status !== 200) {
    throw new Error("AUTH_SESSION_CREATE_FAILED");
  }

  const token = parseSessionToken(signUpResponse.headers.get("set-cookie"));
  const resolvedSession = await auth.api.getSession({
    headers: new Headers({
      cookie: `better-auth.session_token=${token}`,
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
