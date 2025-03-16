"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@src/components/ui/button";
import { ListingRole, LISTING_ROLES } from "@src/types/roles";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
} from "@src/api/listingsApi";
import { Routes } from "@src/constants/routes";

type ListingType =
  | ItemListing
  | RecalledItemListing
  | AbandonedItemListing
  | null;

interface ListingActionsProps {
  listing: ListingType;
  userRole: ListingRole;
  onRemoveTag?: () => Promise<void>;
  onCheckout?: () => Promise<void>;
}

export default function ListingActions({
  listing,
  userRole,
  onRemoveTag,
  onCheckout,
}: ListingActionsProps) {
  const router = useRouter();

  if (!listing) {
    // Handle vacant tag case
    if (userRole === LISTING_ROLES.VIEWER) {
      return (
        <Button
          className="w-full"
          onClick={() => router.push(Routes.MEMBER.ITEMS.NEW)}
        >
          List item
        </Button>
      );
    }

    if (userRole === LISTING_ROLES.HOST) {
      return (
        <Button className="w-full" variant="ghost" disabled>
          Manage
        </Button>
      );
    }

    return null;
  }

  const isRecalled = "recalled_at" in listing;
  const isAbandoned = "abandoned_at" in listing;
  const item = listing.item_details;

  // Viewer actions
  if (userRole === LISTING_ROLES.VIEWER) {
    const buttonProps: ButtonProps = {
      className: "w-full",
      children: "Buy now",
    };

    if (isRecalled || isAbandoned) {
      buttonProps.variant = "ghost";
      buttonProps.disabled = true;
    } else {
      buttonProps.variant = "default";
      buttonProps.onClick = onCheckout;
    }

    return <Button {...buttonProps} />;
  }

  // Owner actions
  if (userRole === LISTING_ROLES.OWNER) {
    const buttonProps: ButtonProps = {
      className: "w-full",
      children: "Edit",
    };

    if (isRecalled || isAbandoned) {
      buttonProps.variant = "ghost";
      buttonProps.disabled = true;
    } else {
      buttonProps.variant = "outline";
      buttonProps.onClick = () =>
        router.push(Routes.MEMBER.ITEMS.DETAILS(item?.id?.toString() || ""));
    }

    return <Button {...buttonProps} />;
  }

  // Host actions
  if (userRole === LISTING_ROLES.HOST) {
    if (isRecalled) {
      return (
        <Button
          className="w-full"
          variant="secondary"
          onClick={() =>
            router.push(Routes.STORE.LISTINGS.DETAILS(listing.id.toString()))
          }
        >
          Confirm Collect
        </Button>
      );
    }

    if (isAbandoned) {
      const abandonedListing = listing as AbandonedItemListing;

      if (abandonedListing.tag_removed) {
        return (
          <Button className="w-full" variant="ghost" disabled>
            Tag Removed
          </Button>
        );
      }

      return (
        <Button className="w-full" variant="outline" onClick={onRemoveTag}>
          Remove tag
        </Button>
      );
    }

    // Active listing
    return (
      <Button
        className="w-full"
        variant="destructive"
        onClick={() =>
          router.push(Routes.STORE.LISTINGS.DETAILS(listing.id.toString()))
        }
      >
        Manage
      </Button>
    );
  }

  return null;
}
