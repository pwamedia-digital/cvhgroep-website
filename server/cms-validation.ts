type RecordLike = Record<string, unknown>;

const MAX_DEPTH = 8;
const MAX_ARRAY_ITEMS = 100;
const MAX_STRING = 20000;
const MAX_KEYS = 300;

function isRecord(value: unknown): value is RecordLike {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanImageObject(value: RecordLike) {
  const src = typeof value.src === "string" ? value.src.trim() : "";
  const original = typeof value.original === "string" ? value.original.trim() : "";
  const alt = typeof value.alt === "string" ? value.alt.trim().slice(0,300) : "";

  const allowed = (url:string) => {
    if (!url) return true;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" &&
        parsed.hostname.endsWith(".public.blob.vercel-storage.com");
    } catch { return false; }
  };

  if (!allowed(src) || !allowed(original)) {
    throw new Error("Afbeelding verwijst naar een niet-toegestane locatie.");
  }
  return { src, ...(original ? { original } : {}), alt };
}

function clean(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) throw new Error("CMS-inhoud is te diep genest.");

  if (typeof value === "string") {
    if (value.length > MAX_STRING) throw new Error("Een tekstveld is te lang.");
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Een numeriek veld is ongeldig.");
    return value;
  }
  if (typeof value === "boolean" || value === null) return value;

  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY_ITEMS) throw new Error("Een lijst bevat te veel items.");
    return value.map(item => clean(item, depth + 1));
  }

  if (isRecord(value)) {
    const keys = Object.keys(value);
    if (keys.length > MAX_KEYS) throw new Error("CMS-inhoud bevat te veel velden.");

    const looksLikeImage = keys.includes("src") && keys.every(k => ["src","original","alt"].includes(k));
    if (looksLikeImage) return cleanImageObject(value);

    const out:RecordLike = {};
    for (const [key,item] of Object.entries(value)) {
      if (!/^[A-Za-z0-9_-]{1,80}$/.test(key)) throw new Error("CMS-veldnaam is ongeldig.");
      out[key] = clean(item, depth + 1);
    }
    return out;
  }

  throw new Error("CMS-inhoud bevat een niet-ondersteund veldtype.");
}

export function validateCmsContent(value: unknown) {
  try {
    if (!isRecord(value)) throw new Error("CMS-inhoud is ongeldig.");
    return { ok:true as const, content:clean(value) as RecordLike };
  } catch (error) {
    return {
      ok:false as const,
      error:error instanceof Error ? error.message : "CMS-inhoud is ongeldig."
    };
  }
}

