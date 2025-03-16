"use client";

import { AlertCircle } from "lucide-react";
import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import { AbandonedItemListing } from "@src/api/listingsApi";
import ListingCard from "../shared/ListingCard";
import ListingActions from "../shared/ListingActions";

interface AbandonedListingProps {
  listing: AbandonedItemListing;
  userRole: ListingRole;
  onRemoveTag?: () => Promise<void>;
}

export default function AbandonedListing({
  listing,
  userRole,
  onRemoveTag,
}: AbandonedListingProps) {
  // Generate status message based on user role
  const statusMessage = (() => {
    if (userRole === LISTING_ROLES.VIEWER) {
      return (
        <div className="flex items-center text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Item is no longer for sale</span>
        </div>
      );
    }

    if (userRole === LISTING_ROLES.OWNER) {
      return (
        <div className="flex items-start text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p>Item has been abandoned</p>
            <p className="text-xs mt-1">Available at the host&apos;s discretion</p>
          </div>
        </div>
      );
    }

    if (userRole === LISTING_ROLES.HOST) {
      return (
        <div className="flex items-center text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Item has been abandoned</span>
        </div>
      );
    }

    return null;
  })();

  return (
    <ListingCard
      listing={listing}
      userRole={userRole}
      statusMessage={statusMessage}
      footerContent={
        <ListingActions
          listing={listing}
          userRole={userRole}
          onRemoveTag={onRemoveTag}
        />
      }
    />
  );
}
