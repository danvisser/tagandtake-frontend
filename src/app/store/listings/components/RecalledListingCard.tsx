"use client";

import { useState } from "react";
import { RecalledItemListing } from "@src/api/listingsApi";
import { Card, CardContent } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { formatCurrency } from "@src/lib/formatters";
import { Routes } from "@src/constants/routes";
import Link from "next/link";
import Image from "next/image";
import { formatShortDate, getImageUrl as getCachedImageUrl } from "@src/lib/utils";

interface RecalledListingCardProps {
  listing: RecalledItemListing;
}

export default function RecalledListingCard({
  listing,
}: RecalledListingCardProps) {
  const [cacheBust] = useState(() => Date.now());
  const item = listing.item_details;
  const image = item?.images?.[0]?.image_url;
  const itemName = item?.name || "Unknown Item";
  const size = item?.attributes?.size || "Unknown";
  const condition = item?.condition_details?.condition || "Unknown";
  const price = listing.listing_price;
  const reason = listing.reason?.reason || "Unknown reason";
  const collectionDeadlineText =
    formatShortDate(listing.collection_deadline) ?? "Unknown date";

  const href = Routes.LISTING.DETAILS(listing.tag.toString());

  return (
    <Link href={href} className="h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
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
            <Badge variant="destructive" className="mb-2">
              Recalled
            </Badge>
            <div className="mt-2 text-xs sm:text-sm text-muted-foreground space-y-1">
              <div>Collect by {collectionDeadlineText}</div>
              <div>{reason}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
