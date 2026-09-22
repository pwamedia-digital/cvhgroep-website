import defaultContent from "@/content/site.json";
import { dbPool } from "@/server/db";

export async function getCmsContent() {
  if (!dbPool) return { draft: defaultContent, published: defaultContent };

  const { rows } = await dbPool.query(
    "SELECT draft,published,updated_at,published_at FROM cms_content WHERE id='site'"
  );

  const current = rows[0] || null;
  const isEmptyObject = (value: unknown) =>
    Boolean(value) && typeof value === "object" && !Array.isArray(value) && Object.keys(value as Record<string, unknown>).length === 0;

  if (!current || isEmptyObject(current.draft) || isEmptyObject(current.published)) {
    const seeded = await dbPool.query(
      `INSERT INTO cms_content (id,draft,published,updated_at)
       VALUES ('site',$1::jsonb,$1::jsonb,now())
       ON CONFLICT (id) DO UPDATE
       SET draft=CASE WHEN cms_content.draft='{}'::jsonb THEN EXCLUDED.draft ELSE cms_content.draft END,
           published=CASE WHEN cms_content.published='{}'::jsonb THEN EXCLUDED.published ELSE cms_content.published END,
           updated_at=now()
       RETURNING draft,published,updated_at,published_at`,
      [JSON.stringify(defaultContent)]
    );
    return seeded.rows[0] || { draft: defaultContent, published: defaultContent };
  }

  return current;
}

export async function saveCmsDraft(content: unknown) {
  if (!dbPool) throw new Error("DATABASE_URL ontbreekt.");

  const result = await dbPool.query(
    "UPDATE cms_content SET draft=$1::jsonb, updated_at=now() WHERE id='site'",
    [JSON.stringify(content)]
  );

  if (result.rowCount !== 1) {
    throw new Error("CMS-content is niet geïnitialiseerd.");
  }
}

export async function publishCmsDraft() {
  if (!dbPool) throw new Error("DATABASE_URL ontbreekt.");

  const { rows } = await dbPool.query(
    `UPDATE cms_content
     SET published=draft, published_at=now(), updated_at=now()
     WHERE id='site'
     RETURNING published`
  );

  if (!rows[0]) throw new Error("CMS-content is niet geïnitialiseerd.");
  return rows[0].published;
}

