import { httpRouter } from "convex/server";
import { ConvexError } from "convex/values";
import { api, internal } from "./_generated/api";
import { type ActionCtx, httpAction } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth, { cors: true });

const requireSession = async (ctx: ActionCtx, request: Request) => {
  const auth = createAuth(ctx);
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    throw new ConvexError("Unauthenticated");
  }

  return session;
};

http.route({
  path: "/api/messages",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      await requireSession(ctx, request);
      const messages = await ctx.runQuery(api.messages.listMessages, {});
      return Response.json({ ok: true, messages }, { status: 200 });
    } catch (error) {
      if (error instanceof ConvexError) {
        return Response.json(
          { ok: false, code: "AUTH_REQUIRED", message: error.message },
          { status: 401 },
        );
      }

      return Response.json(
        { ok: false, code: "SERVER_ERROR", message: "Unable to list messages" },
        { status: 500 },
      );
    }
  }),
});

http.route({
  path: "/api/messages",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const session = await requireSession(ctx, request);
      const payload = (await request.json()) as { body?: string };
      const body = payload.body ?? "";
      const created = await ctx.runMutation(internal.messages.createMessage, {
        authorId: session.user.id,
        body,
      });

      return Response.json({ ok: true, message: created }, { status: 200 });
    } catch (error) {
      if (error instanceof ConvexError) {
        return Response.json(
          { ok: false, code: "AUTH_REQUIRED", message: error.message },
          { status: 401 },
        );
      }

      return Response.json(
        { ok: false, code: "SERVER_ERROR", message: "Unable to create message" },
        { status: 500 },
      );
    }
  }),
});

export default http;
