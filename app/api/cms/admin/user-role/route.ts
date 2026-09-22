import { requirePwamediaAdmin } from "@/server/cms-access";
import { writeCmsAudit } from "@/server/cms-audit";
import { dbPool } from "@/server/db";

const allowedRoles = new Set(["pwamedia_admin", "klantbeheerder"]);

export async function POST(request: Request) {
  const access = await requirePwamediaAdmin(request, { write: true });
  if (!access.ok) return access.response;
  if (!dbPool) return Response.json({ error: "Database niet beschikbaar." }, { status: 503 });

  const body = await request.json().catch(() => null);
  const userId = String(body?.userId || "");
  const role = String(body?.role || "");

  if (!userId || !allowedRoles.has(role)) {
    return Response.json({ error: "Ongeldige gebruiker of rol." }, { status: 400 });
  }

  if (userId === access.user.id) {
    return Response.json({ error: "Je kunt je eigen PWAMEDIA-rol hier niet wijzigen." }, { status: 400 });
  }

  if (role === "klantbeheerder") {
    const existing = await dbPool.query(
      `SELECT id,email FROM "user" WHERE role='klantbeheerder' AND id<>$1 LIMIT 1`,
      [userId]
    );
    if (existing.rows[0]) {
      return Response.json(
        { error: `Deze website heeft al een klantbeheerder: ${existing.rows[0].email}.` },
        { status: 409 }
      );
    }
  }

  try {
    const result = await dbPool.query(
      `UPDATE "user"
       SET role=$1,"updatedAt"=now()
       WHERE id=$2
       RETURNING id,email,name,role`,
      [role, userId]
    );

    const target = result.rows[0];
    if (!target) {
      return Response.json({ error: "Gebruiker niet gevonden." }, { status: 404 });
    }

    await writeCmsAudit({
      actorUserId: access.user.id,
      action: "security.change_role",
      targetUserId: userId,
      metadata: { role, targetEmail: target.email },
      request,
    });

    return Response.json({ ok: true, user: target });
  } catch (error: any) {
    if (error?.code === "23505") {
      return Response.json({ error: "Deze website kan maar één klantbeheerder hebben." }, { status: 409 });
    }
    console.error("CMS role change failed:", error);
    return Response.json({ error: "Rol wijzigen mislukt." }, { status: 500 });
  }
}

