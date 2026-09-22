import { headers } from "next/headers";
import CvhSiteClient from "./CvhSiteClient";
import { getCmsSession } from "@/server/cms-access";
import { getCmsContent } from "@/server/cms-content";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const wantsDraft = params.cmsDraft === "1";
  const session = wantsDraft ? await getCmsSession(await headers()) : null;
  const stored = await getCmsContent();
  const content = wantsDraft && session ? stored.draft : stored.published;

  return <CvhSiteClient content={content} />;
}
