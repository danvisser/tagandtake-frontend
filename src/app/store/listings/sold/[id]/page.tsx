import { redirect } from "next/navigation";
import { Routes } from "@src/constants/routes";

export default function SoldListingDetailRedirect({
  params,
}: {
  params: { id: string };
}) {
  redirect(`${Routes.STORE.LISTINGS.DETAILS(params.id)}?tab=sold`);
}
