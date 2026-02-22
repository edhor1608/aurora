export type Session = {
  userId: string;
  issuedAt: number;
  expiresAt: number;
};

export type CreateSessionInput = {
  userId: string;
  ttlSeconds: number;
  now: number;
};

export const createSession = (input: CreateSessionInput): Session => {
  return {
    userId: input.userId,
    issuedAt: input.now,
    expiresAt: input.now + input.ttlSeconds * 1000,
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
