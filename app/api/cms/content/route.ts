import { requireCmsAccess } from "@/server/cms-access";
import { validateCmsContent } from "@/server/cms-validation";
import { getCmsContent, publishCmsDraft, saveCmsDraft } from "@/server/cms-content";
import { writeCmsAudit } from "@/server/cms-audit";

const MAX_CONTENT_BYTES = 256 * 1024;

export async function GET(request: Request) {
  const access = await requireCmsAccess(request);
  if (!access.ok) return access.response;

  const content = await getCmsContent();
  return Response.json({ content }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  const access = await requireCmsAccess(request, { write: true });
  if (!access.ok) return access.response;

  const declaredSize = Number(request.headers.get("content-length") || "0");
  if (declaredSize > MAX_CONTENT_BYTES) {
    return Response.json({ error: "CMS-inhoud is te groot." }, { status: 413 });
  }

  const body = await request.json().catch(() => null);
  const validated = validateCmsContent(body?.content);
  if (!validated.ok) {
    return Response.json({ error: validated.error }, { status: 400 });
  }

  await saveCmsDraft(validated.content);
  await writeCmsAudit({ actorUserId: access.user.id, action: "content.save_draft", request });
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  const access = await requireCmsAccess(request, { write: true });
  if (!access.ok) return access.response;

  const published = await publishCmsDraft();
  await writeCmsAudit({ actorUserId: access.user.id, action: "content.publish", request });
  return Response.json({ ok: true, published });
}

