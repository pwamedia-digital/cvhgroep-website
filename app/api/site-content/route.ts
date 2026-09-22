import { getCmsContent } from "@/server/cms-content";

export async function GET() {
  const content = await getCmsContent();
  return Response.json({ content: content.published }, {
    headers: { "Cache-Control": "no-store" }
  });
}

