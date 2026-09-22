import { clearPwamediaSsoCookie } from "@/server/cms-sso";

export async function POST() {
  const response = Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.headers.append("Set-Cookie", clearPwamediaSsoCookie());
  return response;
}

