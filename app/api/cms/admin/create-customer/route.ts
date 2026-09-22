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
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();

  if (!name || name.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return Response.json({ error: "Controleer naam en e-mailadres." }, { status: 400 });
  }

  const existingCustomer = await dbPool.query(
    `SELECT id,email FROM "user" WHERE role='klantbeheerder' LIMIT 1`
  );
  if (existingCustomer.rows[0]) {
    return Response.json(
      { error: `Deze website heeft al een klantbeheerder: ${existingCustomer.rows[0].email}.` },
      { status: 409 }
    );
  }

  let createdUserId: string | null = null;

  try {
    const result = await auth.api.createUser({
      body: { name, email, role: "klantbeheerder" },
    });
    createdUserId = result.user.id;

    try {
      await sendCmsPasswordLink({
        userId: result.user.id,
        email: result.user.email,
        requestUrl: request.url,
      });
    } catch (error) {
      await dbPool.query(
        `DELETE FROM "user" WHERE id=$1 AND role='klantbeheerder'`,
        [result.user.id]
      ).catch(() => {});
      throw error;
    }

    await writeCmsAudit({
      actorUserId: access.user.id,
      action: "security.create_customer",
      targetUserId: result.user.id,
      metadata: { targetEmail: result.user.email, role: "klantbeheerder", activationLinkRequested: true },
      request,
    });

    return Response.json({
      ok: true,
      user: { id: result.user.id, name: result.user.name, email: result.user.email, role: "klantbeheerder" },
      activationEmailRequested: true,
    });
  } catch (error: any) {
    console.error("CMS customer creation failed:", error);
    const message = String(error?.message || "");
    if (error?.code === "23505" || /already|exists|duplicate|unique/i.test(message)) {
      return Response.json({ error: "Er bestaat al een klantbeheerder of een account met dit e-mailadres." }, { status: 409 });
    }
    if (createdUserId) {
      console.error("CMS customer creation rolled back after activation request failure:", createdUserId);
    }
    return Response.json({ error: "Klantaccount aanmaken of activatielink aanvragen mislukt." }, { status: 500 });
  }
}

