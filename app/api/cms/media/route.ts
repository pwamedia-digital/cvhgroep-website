import { put } from "@vercel/blob";
import { requireCmsAccess } from "@/server/cms-access";
import { writeCmsAudit } from "@/server/cms-audit";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function validSection(value: string) {
  return /^[a-z0-9_-]{1,80}$/.test(value);
}

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

async function hasValidSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (file.type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (file.type === "image/png") {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return png.every((value, index) => bytes[index] === value);
  }

  if (file.type === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }

  return false;
}

export async function POST(request: Request) {
  const access = await requireCmsAccess(request, { write: true });
  if (!access.ok) return access.response;

  const form = await request.formData();
  const file = form.get("file");
  const section = String(form.get("section") || "media").toLowerCase();

  if (!(file instanceof File)) {
    return Response.json({ error: "Geen afbeelding ontvangen." }, { status: 400 });
  }

  if (!validSection(section)) {
    return Response.json({ error: "Ongeldige afbeeldingssectie." }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL_OIDC_TOKEN) {
    return Response.json(
      { error: "Media-opslag is nog niet actief in deze deployment. Start een nieuwe deployment en probeer opnieuw." },
      { status: 503 }
    );
  }

  if (!allowedTypes.has(file.type) || !(await hasValidSignature(file))) {
    return Response.json(
      { error: "Alleen geldige JPG-, PNG- en WebP-afbeeldingen zijn toegestaan." },
      { status: 400 }
    );
  }

  if (file.size <= 0 || file.size > 8 * 1024 * 1024) {
    return Response.json({ error: "Afbeelding is te groot. Maximum 8 MB." }, { status: 400 });
  }

  const baseName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "image";

  const pathname = `cms/${section}/${Date.now()}-${baseName}.${extensionFor(file.type)}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    await writeCmsAudit({ actorUserId: access.user.id, action: "media.upload", metadata: { section, pathname: blob.pathname }, request });

    return Response.json({
      ok: true,
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });
  } catch (error) {
    console.error("CMS media upload failed:", error);
    return Response.json({ error: "Upload mislukt. Probeer opnieuw." }, { status: 500 });
  }
}

