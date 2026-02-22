import { signIn, signOut, signUp, useSession } from "@/lib/auth-client";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { type FormEvent, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";

type StatusTone = "idle" | "error" | "success";

type StatusState = {
  message: string;
  tone: StatusTone;
};

const defaultStatus: StatusState = {
  message: "Ready",
  tone: "idle",
};

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("hello@aurora.test");
  const [password, setPassword] = useState("Password123!");
  const [name, setName] = useState("Aurora Tester");
  const [messageInput, setMessageInput] = useState("hello world");
  const [status, setStatus] = useState<StatusState>(defaultStatus);
  const [isBusy, setIsBusy] = useState(false);

  const routeContext = Route.useRouteContext();
  const { data: sessionData, isPending: isSessionPending } = useSession();
  const isSignedIn = useMemo(
    () => Boolean(sessionData?.session || routeContext.session),
    [routeContext.session, sessionData?.session],
  );
  const messagesQuery = useQuery({
    ...convexQuery(api.messages.listMessages, isSignedIn ? {} : "skip"),
    gcTime: 5_000,
  });
  const sendMessageFn = useConvexMutation(api.messages.sendMessage);
  const sendMessage = useMutation({ mutationFn: sendMessageFn });

  const setError = (message: string) => setStatus({ message, tone: "error" });
  const setSuccess = (message: string) => setStatus({ message, tone: "success" });

  const onSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsBusy(true);
    setStatus({ message: "Creating account...", tone: "idle" });
    const result = await signUp.email({ email, password, name });
    if (result.error) {
      setError(result.error.message || "Sign up failed");
      setIsBusy(false);
      return;
    }
    await router.invalidate();
    setSuccess("Signed up");
    setIsBusy(false);
  };

  const onSignIn = async () => {
    setIsBusy(true);
    setStatus({ message: "Signing in...", tone: "idle" });
    const result = await signIn.email({ email, password });
    if (result.error) {
      setError(result.error.message || "Sign in failed");
      setIsBusy(false);
      return;
    }
    await router.invalidate();
    setSuccess("Signed in");
    setIsBusy(false);
  };

  const onSignOut = async () => {
    setIsBusy(true);
    setStatus({ message: "Signing out...", tone: "idle" });
    await signOut();
    await router.invalidate();
    setSuccess("Signed out");
    setIsBusy(false);
  };

  const onSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedBody = messageInput.trim();
    if (!normalizedBody) {
      setError("Message body cannot be empty");
      return;
    }

    setIsBusy(true);
    setStatus({ message: "Sending message...", tone: "idle" });
    try {
      await sendMessage.mutateAsync({ body: normalizedBody });
      setMessageInput("");
      setSuccess("Message sent");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send message";
      setError(message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main className="page">
      <h1>Aurora Hello World</h1>
      <p className="hint">
        Real MVP slice: Better Auth + Convex + TanStack Start with persisted messages.
      </p>

      <section className="panel">
        <h2>Auth</h2>
        <form className="stack" onSubmit={onSignUp}>
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
            <button disabled={isBusy} onClick={() => void onSignIn()} type="button">
              Sign in
            </button>
            <button disabled={isBusy || !isSignedIn} onClick={() => void onSignOut()} type="button">
              Sign out
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <h2>Session</h2>
        {isSessionPending ? (
          <p className="hint">Loading session...</p>
        ) : sessionData?.user ? (
          <p className="mono">
            {sessionData.user.name} ({sessionData.user.email}) [{sessionData.user.id}]
          </p>
        ) : (
          <p className="hint">No active session</p>
        )}
      </section>

      <section className="panel">
        <h2>Hello Message</h2>
        <form className="stack" onSubmit={onSendMessage}>
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
          </div>
        </form>
        <ul className="messages">
          {(messagesQuery.data ?? []).map((message) => (
            <li className="message" key={message.messageId}>
              <p>{message.body}</p>
              <small className="mono">
                {message.authorId} · {new Date(message.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      </section>

      <p className={`status mono ${status.tone === "error" ? "status-error" : ""}`}>
        {status.message}
      </p>
    </main>
  );
}
