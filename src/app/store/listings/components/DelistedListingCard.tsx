"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { formatCurrency } from "@src/lib/formatters";
import { formatShortDate, getImageUrl as getCachedImageUrl } from "@src/lib/utils";
import { Routes } from "@src/constants/routes";
import { StoreDelistedListing } from "@src/api/listingsApi";

interface DelistedListingCardProps {
  listing: StoreDelistedListing;
}

export default function DelistedListingCard({ listing }: DelistedListingCardProps) {
  const [cacheBust] = useState(() => Date.now());

  const item = listing.item_details;
  const image = item?.images?.[0]?.image_url;
  const itemName = item?.name || "Unknown Item";
  const size = item?.size || "Unknown";
  const condition = item?.condition_details?.condition || "Unknown";
  const price = listing.listing_price;

  const isAbandoned = listing.status === "abandoned";
  const needsTagRemoved =
    isAbandoned && (listing.tag_removed === false || listing.needs_tag_removed === true);

  const eventAtText = formatShortDate(listing.event_at);
  const statusLabel = isAbandoned ? "Abandoned" : "Delisted";
  const statusVariant = isAbandoned
    ? ("destructive" as const)
    : ("secondary-inverse" as const);

  const href = needsTagRemoved
    ? Routes.LISTING.DETAILS(listing.tag.toString())
    : listing.status === "abandoned"
      ? `${Routes.STORE.LISTINGS.DETAILS(listing.id.toString())}?tab=abandoned`
      : `${Routes.STORE.LISTINGS.DETAILS(listing.id.toString())}?tab=delisted`;

  return (
    <Link href={href} className="h-full">
      <Card
        className={[
          "overflow-hidden h-full flex flex-col",
          "hover:shadow-lg transition-shadow cursor-pointer",
        ].join(" ")}
      >
        {image && (
          <div className="relative w-full h-48 flex-shrink-0">
            <Image
              src={getCachedImageUrl(image, cacheBust)}
              alt={itemName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-lg mb-1">{itemName}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
            {size} • {condition}
          </p>

          <div className="mt-auto">
            <p className="text-base sm:text-lg font-normal mb-4">
              {formatCurrency(price)}
            </p>
            <Badge variant={statusVariant} className="mb-2">
              {statusLabel}
            </Badge>

            <div className="mt-2 text-xs sm:text-sm text-muted-foreground space-y-1">
              {listing.reason?.reason && <div>{listing.reason.reason}</div>}
              {eventAtText && <div>{eventAtText}</div>}
              {needsTagRemoved && <div className="text-destructive">Tag still attached</div>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

