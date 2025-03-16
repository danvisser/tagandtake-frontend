"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { Routes } from "@src/constants/routes";

interface ListingNavigationProps {
  userRole: ListingRole;
}

export default function ListingNavigation({
  userRole,
}: ListingNavigationProps) {
  // No navigation for viewers
  if (userRole === LISTING_ROLES.VIEWER) {
    return null;
  }

  let navigationText = "";
  let navigationPath = "";

  // Determine navigation text and path based on role
  if (userRole === LISTING_ROLES.OWNER) {
    navigationText = "My wardrobe";
    navigationPath = Routes.MEMBER.ITEMS.ROOT;
  } else if (userRole === LISTING_ROLES.HOST) {
    navigationText = "All listings";
    navigationPath = Routes.STORE.LISTINGS.ROOT;
  }

  return (
    <div className="mb-6">
      <Link
        href={navigationPath}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {navigationText}
      </Link>
    </div>
  );
}
