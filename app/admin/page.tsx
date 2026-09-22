import "./admin.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getCmsIdentity } from "@/server/cms-access";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Websitebeheer · PWAMEDIA",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminPage() {
  const identity = await getCmsIdentity(await headers());
  return <AdminClient initialSession={(identity?.session || null) as any} />;
}

