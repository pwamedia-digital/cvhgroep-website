import { randomBytes } from "node:crypto";
import { dbPool } from "@/server/db";
import { cmsEmailEnabled, sendCmsEmail } from "@/server/email";

export async function sendCmsPasswordLink({
  userId,
  email,
  requestUrl,
}: {
  userId: string;
  email: string;
  requestUrl: string;
}) {
  if (!dbPool) throw new Error("Database niet beschikbaar.");
  if (!cmsEmailEnabled) throw new Error("CMS-e-mail is niet geconfigureerd.");

  const token = randomBytes(24).toString("base64url");
  const verificationId = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const origin = new URL(requestUrl).origin;
  const callbackURL = `${origin}/admin`;
  const url = new URL(`/api/auth/reset-password/${token}`, origin);
  url.searchParams.set("callbackURL", callbackURL);

  const client = await dbPool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `DELETE FROM verification
       WHERE value=$1 AND identifier LIKE 'reset-password:%'`,
      [userId]
    );
    await client.query(
      `INSERT INTO verification
       (id,identifier,value,"expiresAt","createdAt","updatedAt")
       VALUES ($1,$2,$3,$4,now(),now())`,
      [verificationId, `reset-password:${token}`, userId, expiresAt]
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }

  try {
    const siteName = process.env.CMS_SITE_NAME || "je website";
    await sendCmsEmail({
      to: email,
      subject: `Stel je wachtwoord in · ${siteName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#17221d">
          <p style="font-size:12px;font-weight:700;letter-spacing:.12em;color:#6f7c75">PWAMEDIA CMS</p>
          <h1 style="font-size:28px">Stel je wachtwoord in</h1>
          <p>Voor <strong>${siteName}</strong> werd een beveiligde link aangemaakt om je CMS-wachtwoord in te stellen of opnieuw in te stellen.</p>
          <p><a href="${url.toString()}" style="display:inline-block;padding:12px 18px;background:#17221d;color:white;text-decoration:none;border-radius:8px">Wachtwoord instellen</a></p>
          <p>Deze link is 60 minuten geldig en kan maar één keer gebruikt worden.</p>
          <p style="font-size:12px;color:#66736c">Heb je dit niet aangevraagd? Dan kun je deze e-mail veilig negeren.</p>
        </div>`,
    });
  } catch (error) {
    await dbPool.query(
      `DELETE FROM verification WHERE identifier=$1`,
      [`reset-password:${token}`]
    ).catch(() => {});
    throw error;
  }

  return { expiresAt };
}

