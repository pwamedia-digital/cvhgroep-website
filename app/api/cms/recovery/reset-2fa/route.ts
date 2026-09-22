import { requirePwamediaAdmin } from "@/server/cms-access";
import { writeCmsAudit } from "@/server/cms-audit";
import { dbPool } from "@/server/db";

export async function POST(request: Request) {
  const access = await requirePwamediaAdmin(request, { write: true });
  if (!access.ok) return access.response;
  if (!dbPool) return Response.json({ error: "Database niet beschikbaar." }, { status: 503 });

  const body = await request.json().catch(() => null);
  const userId = String(body?.userId || "");
  const reason = String(body?.reason || "").trim();
  const confirmation = String(body?.confirmation || "");

  if (!userId || reason.length < 8 || reason.length > 500 || confirmation !== "RESET 2FA") {
    return Response.json(
      { error: "Gebruiker, duidelijke reden en bevestiging RESET 2FA zijn verplicht." },
      { status: 400 }
    );
  }

  if (userId === access.user.id) {
    return Response.json({ error: "Je kunt je eigen PWAMEDIA-2FA hier niet resetten." }, { status: 400 });
  }

  const client = await dbPool.connect();
  try {
    await client.query("BEGIN");

    const targetResult = await client.query(
      `SELECT id,email,role,"twoFactorEnabled"
       FROM "user"
       WHERE id=$1
       FOR UPDATE`,
      [userId]
    );

    const target = targetResult.rows[0];
    if (!target) {
      await client.query("ROLLBACK");
      return Response.json({ error: "Gebruiker niet gevonden." }, { status: 404 });
    }

    if (target.role !== "klantbeheerder") {
      await client.query("ROLLBACK");
      return Response.json({ error: "Alleen klantaccounts kunnen via deze flow hersteld worden." }, { status: 403 });
    }

    await client.query(`DELETE FROM "twoFactor" WHERE "userId"=$1`, [userId]);
    await client.query(`UPDATE "user" SET "twoFactorEnabled"=false,"updatedAt"=now() WHERE id=$1`, [userId]);
    const revoked = await client.query(`DELETE FROM session WHERE "userId"=$1`, [userId]);

    await client.query("COMMIT");

    await writeCmsAudit({
      actorUserId: access.user.id,
      action: "security.reset_2fa",
      targetUserId: userId,
      metadata: {
        reason,
        revokedSessions: revoked.rowCount || 0,
        targetEmail: target.email,
      },
      request,
    });

    return Response.json({
      ok: true,
      message: "2FA is gereset. Alle sessies zijn ingetrokken; de klant moet bij de volgende login opnieuw 2FA instellen.",
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("CMS 2FA recovery failed:", error);
    return Response.json({ error: "2FA-recovery mislukt." }, { status: 500 });
  } finally {
    client.release();
  }
}

