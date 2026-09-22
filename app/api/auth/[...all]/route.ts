import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/server/auth";

function unavailable() {
  return Response.json(
    { error: "CMS-auth is nog niet geconfigureerd." },
    { status: 503 }
  );
}

const handler = auth ? toNextJsHandler(auth) : null;

export const GET = handler?.GET || unavailable;
export const POST = handler?.POST || unavailable;

