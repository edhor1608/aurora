import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type SessionPayload = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  session: {
    id: string;
    userId: string;
  };
};

type MessagePayload = {
  messageId: string;
  authorId: string;
  body: string;
  createdAt: number;
};

type MessagesResponse = {
  ok: boolean;
  messages: MessagePayload[];
};

const parseJson = async <T,>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const readErrorMessage = async (response: Response): Promise<string> => {
  const payload = await parseJson<{ message?: string; code?: string }>(response);
  return payload?.message ?? payload?.code ?? `Request failed (${response.status})`;
};

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [email, setEmail] = useState("hello@aurora.test");
  const [password, setPassword] = useState("Password123!");
  const [name, setName] = useState("Aurora Tester");
  const [messageInput, setMessageInput] = useState("hello world");
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [status, setStatus] = useState("Ready");
  const [isBusy, setIsBusy] = useState(false);

  const isSignedIn = useMemo(() => Boolean(session), [session]);

  const refreshSession = useCallback(async () => {
    const response = await fetch("/api/auth/get-session", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      setSession(null);
      return;
    }

    const payload = await parseJson<SessionPayload | null>(response);
    setSession(payload);
  }, []);

  const refreshMessages = useCallback(async () => {
    const response = await fetch("/api/messages", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      setStatus(message);
      setMessages([]);
      return;
    }

    const payload = await parseJson<MessagesResponse>(response);
    setMessages(payload?.messages ?? []);
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (!isSignedIn) {
      setMessages([]);
      return;
    }

    void refreshMessages();
  }, [isSignedIn, refreshMessages]);

  const signUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsBusy(true);
    setStatus("Creating account...");

    const response = await fetch("/api/auth/sign-up/email", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (!response.ok) {
      setStatus(await readErrorMessage(response));
      setIsBusy(false);
      return;
    }

    await refreshSession();
    await refreshMessages();
    setStatus("Signed up");
    setIsBusy(false);
  };

  const signIn = async () => {
    setIsBusy(true);
    setStatus("Signing in...");

    const response = await fetch("/api/auth/sign-in/email", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      setStatus(await readErrorMessage(response));
      setIsBusy(false);
      return;
    }

    await refreshSession();
    await refreshMessages();
    setStatus("Signed in");
    setIsBusy(false);
  };

  const signOut = async () => {
    setIsBusy(true);
    setStatus("Signing out...");

    const response = await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      setStatus(await readErrorMessage(response));
      setIsBusy(false);
      return;
    }

    setSession(null);
    setMessages([]);
    setStatus("Signed out");
    setIsBusy(false);
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!messageInput.trim()) {
      setStatus("Message body cannot be empty");
      return;
    }

    setIsBusy(true);
    setStatus("Sending message...");

    const response = await fetch("/api/messages", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        body: messageInput,
      }),
    });

    if (!response.ok) {
      setStatus(await readErrorMessage(response));
      setIsBusy(false);
      return;
    }

    setMessageInput("");
    await refreshMessages();
    setStatus("Message sent");
    setIsBusy(false);
  };

  return (
    <main className="page">
      <h1>Aurora Hello World</h1>
      <p className="hint">
        Minimal vertical slice: Better Auth + Convex + real message persistence.
      </p>

      <section className="panel">
        <h2>Auth</h2>
        <form className="stack" onSubmit={signUp}>
          <label className="field">
            <span>Name</span>
            <input
              autoComplete="name"
              disabled={isBusy}
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              autoComplete="email"
              disabled={isBusy}
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              autoComplete="current-password"
              disabled={isBusy}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>
          <div className="row">
            <button disabled={isBusy} type="submit">
              Sign up
            </button>
            <button disabled={isBusy} onClick={() => void signIn()} type="button">
              Sign in
            </button>
            <button disabled={isBusy || !isSignedIn} onClick={signOut} type="button">
              Sign out
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <h2>Session</h2>
        {session ? (
          <p className="mono">
            {session.user.name} ({session.user.email}) [{session.user.id}]
          </p>
        ) : (
          <p className="hint">No active session</p>
        )}
      </section>

      <section className="panel">
        <h2>Hello Message</h2>
        <form className="stack" onSubmit={sendMessage}>
          <label className="field">
            <span>Message</span>
            <input
              disabled={isBusy || !isSignedIn}
              onChange={(event) => setMessageInput(event.target.value)}
              value={messageInput}
            />
          </label>
          <div className="row">
            <button disabled={isBusy || !isSignedIn} type="submit">
              Send
            </button>
            <button
              disabled={isBusy || !isSignedIn}
              onClick={() => void refreshMessages()}
              type="button"
            >
              Refresh
            </button>
          </div>
        </form>
        <ul className="messages">
          {messages.map((message) => (
            <li className="message" key={message.messageId}>
              <p>{message.body}</p>
              <small className="mono">
                {message.authorId} · {new Date(message.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      </section>

      <p className="status mono">{status}</p>
    </main>
  );
}
