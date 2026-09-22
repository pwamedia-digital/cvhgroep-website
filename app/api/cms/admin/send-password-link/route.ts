import { auth } from "@/server/auth";
import { requirePwamediaAdmin } from "@/server/cms-access";
import { writeCmsAudit } from "@/server/cms-audit";
import { dbPool } from "@/server/db";
import { cmsEmailEnabled } from "@/server/email";
import { sendCmsPasswordLink } from "@/server/cms-password-link";

export async function POST(request: Request) {
  const access = await requirePwamediaAdmin(request, { write: true });
  if (!access.ok) return access.response;
  if (!auth || !dbPool) return Response.json({ error: "Authenticatie of database is niet beschikbaar." }, { status: 503 });
  if (!cmsEmailEnabled) return Response.json({ error: "CMS-e-mail is nog niet geconfigureerd." }, { status: 503 });

  const body = await request.json().catch(() => null);
  const userId = String(body?.userId || "");

  if (!userId) {
    return Response.json({ error: "Gebruiker ontbreekt." }, { status: 400 });
  }

  const targetResult = await dbPool.query(
    `SELECT id,email,role FROM "user" WHERE id=$1 LIMIT 1`,
    [userId]
  );
  const target = targetResult.rows[0];

  if (!target) {
    return Response.json({ error: "Gebruiker niet gevonden." }, { status: 404 });
  }
  if (target.role !== "klantbeheerder") {
    return Response.json({ error: "Alleen een klantbeheerder kan via deze flow een wachtwoordlink krijgen." }, { status: 403 });
  }

  try {
    await sendCmsPasswordLink({
      userId: target.id,
      email: target.email,
      requestUrl: request.url,
    });

    await writeCmsAudit({
      actorUserId: access.user.id,
      action: "security.send_password_link",
      targetUserId: target.id,
      metadata: { targetEmail: target.email },
      request,
    });

    return Response.json({
      ok: true,
      message: "Een beveiligde activatie-/wachtwoordlink is aangevraagd.",
    });
  } catch (error) {
    console.error("CMS password link request failed:", error);
    return Response.json({ error: "Wachtwoordlink aanvragen mislukt." }, { status: 500 });
  }
}

