"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ListingRole, ListingRoles } from "@src/types/roles";
import { Routes } from "@src/constants/routes";

interface ListingNavigationProps {
  userRole: ListingRole | null;
}

export default function ListingNavigation({
  userRole,
}: ListingNavigationProps) {
  let backLink = Routes.HOME;
  let backText = "Home";

  if (userRole === ListingRoles.HOST) {
    backLink = Routes.STORE.LISTINGS.ROOT;
    backText = "Store Listings";
  } else if (userRole === ListingRoles.OWNER) {
    backLink = Routes.MEMBER.ROOT;
    backText = "My Items";
  }

  return (
    <div className="mb-6">
      <Link
        href={backLink}
        className="inline-flex max-w-full items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ChevronLeft className="h-4 w-4 shrink-0" />
        <span className="min-w-0 truncate">Back to {backText}</span>
      </Link>
    </div>
  );
}
