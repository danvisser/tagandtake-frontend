"use client";

import { SoldItemListing } from "@src/api/listingsApi";
import { Card, CardContent } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { formatCurrency } from "@src/lib/formatters";
import { Routes } from "@src/constants/routes";
import Link from "next/link";
import Image from "next/image";

interface SoldListingCardProps {
  listing: SoldItemListing;
}

export default function SoldListingCard({
  listing,
}: SoldListingCardProps) {
  const item = listing.item_details;
  const image = item?.images?.[0]?.image_url;
  const itemName = item?.name || "Unknown Item";
  const category = item?.category_details?.name || "Unknown";
  const price = listing.listing_price;
  const soldAt = new Date(listing.sold_at);
  const storeCommission = listing.store_commission_amount;
  const tagRemoved = listing.tag_removed;

  return (
    <Card className="overflow-hidden">
      {image && (
        <div className="relative w-full h-48">
          <Image src={image} alt={itemName} fill className="object-cover" />
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{itemName}</h3>
        <p className="text-sm text-muted-foreground mb-2">{category}</p>
        <p className="text-xl font-semibold mb-4">{formatCurrency(price)}</p>

        <div className="space-y-2 mb-4 text-sm">
          <div className="text-muted-foreground">
            Sold: {soldAt.toLocaleDateString()}
          </div>
          <div className="font-medium">
            Commission: {formatCurrency(storeCommission)}
          </div>
          <div className="text-muted-foreground">
            Tag: {tagRemoved ? "Removed" : "Attached"}
          </div>
        </div>

        <Badge variant="default" className="mb-4 bg-green-600">
          Sold
        </Badge>

        <Link href={Routes.STORE.LISTINGS.SOLD(listing.id.toString())}>
          <div className="text-sm text-primary hover:underline cursor-pointer">
            View Details
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
