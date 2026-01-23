"use client";

import { useState } from "react";
import { ItemListing } from "@src/api/listingsApi";
import { Card, CardContent } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { formatCurrency } from "@src/lib/formatters";
import { Routes } from "@src/constants/routes";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl as getCachedImageUrl } from "@src/lib/utils";

interface ActiveListingCardProps {
  listing: ItemListing;
}

export default function ActiveListingCard({ listing }: ActiveListingCardProps) {
  const [cacheBust] = useState(() => Date.now());
  const item = listing.item_details;
  const image = item?.images?.[0]?.image_url;
  const itemName = item?.name || "Unknown Item";
  const size = item?.attributes?.size || "Unknown";
  const condition = item?.condition_details?.condition || "Unknown";
  const price = listing.listing_price;

  // Calculate days listed
  const daysListed = listing.created_at
    ? Math.floor(
      (new Date().getTime() - new Date(listing.created_at).getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : 0;

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
            <Badge variant="default" className="mb-2">
              Active
            </Badge>
            <div className="mt-2 text-xs sm:text-sm text-muted-foreground space-y-1">
              <div>Tag #{listing.tag}</div>
              {listing.past_min_listing_days ? (
                <div className="text-destructive">Past display period guarantee</div>
              ) : (
                <div>{daysListed} days listed</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
