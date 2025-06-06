"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { Routes } from "@src/constants/routes";

interface ListingNavigationProps {
  userRole: ListingRole | null;
}

export default function ListingNavigation({
  userRole,
}: ListingNavigationProps) {
  let backLink = Routes.HOME;
  let backText = "Home";

  if (userRole === LISTING_ROLES.HOST) {
    backLink = Routes.STORE.LISTINGS.ROOT;
    backText = "Store Listings";
  } else if (userRole === LISTING_ROLES.OWNER) {
    backLink = Routes.MEMBER.ITEMS.ROOT;
    backText = "My Items";
  }

  return (
    <div className="mb-6">
      <Link
        href={backLink}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to {backText}
      </Link>
    </div>
  );
}
