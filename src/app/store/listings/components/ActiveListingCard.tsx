"use client";

import { ItemListing } from "@src/api/listingsApi";
import { Card, CardContent } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { formatCurrency } from "@src/lib/formatters";
import { Routes } from "@src/constants/routes";
import Link from "next/link";
import Image from "next/image";

interface ActiveListingCardProps {
  listing: ItemListing;
}

export default function ActiveListingCard({ listing }: ActiveListingCardProps) {
  const item = listing.item_details;
  const image = item?.images?.[0]?.image_url;
  const itemName = item?.name || "Unknown Item";
  const category = item?.category_details?.name || "Unknown";
  const condition = item?.condition_details?.condition || "Unknown";
  const price = listing.listing_price;

  // Calculate days listed
  const daysListed = listing.created_at
    ? Math.floor(
      (new Date().getTime() - new Date(listing.created_at).getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : 0;

  return (
    <Card className="overflow-hidden">
      {image && (
        <div className="relative w-full h-48">
          <Image
            src={image}
            alt={itemName}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{itemName}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {category} • {condition}
        </p>
        <p className="text-xl font-semibold mb-4">{formatCurrency(price)}</p>

        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div>Days listed: {daysListed}</div>
          <div>Tag: #{listing.tag}</div>
        </div>

        <Badge variant="default" className="mb-4">
          Active
        </Badge>

        <Link href={Routes.LISTING.DETAILS(listing.tag.toString())}>
          <Button className="w-full">Manage</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
