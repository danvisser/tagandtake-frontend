import { redirect } from "next/navigation";
import { Routes } from "@src/constants/routes";

export default async function RecalledListingDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`${Routes.STORE.LISTINGS.DETAILS(id)}?tab=recalled`);
}
