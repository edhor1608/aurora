import { handler } from "@/lib/auth-server";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handler(request),
      POST: ({ request }: { request: Request }) => handler(request),
    },
  },
});
