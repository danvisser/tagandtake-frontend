"use client";

import { Item, ITEM_STATUS } from "@src/api/itemsApi";
import { Card, CardContent } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { formatCurrency } from "@src/lib/formatters";
import { Routes } from "@src/constants/routes";
import Link from "next/link";
import Image from "next/image";
import { Store } from "lucide-react";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const image = item.images?.[0]?.image_url;
  const itemName = item.name || "Unknown Item";
  const size = item.size || "Unknown";
  const condition = item.condition_details?.condition || "Unknown";
  const price = item.price;
  const status = item.status || ITEM_STATUS.AVAILABLE;

  // Get status badge variant - matching listing cards
  const getStatusBadge = () => {
    switch (status) {
      case ITEM_STATUS.LISTED:
        return { label: "Listed", variant: "default" as const };
      case ITEM_STATUS.RECALLED:
        return { label: "Recalled", variant: "destructive" as const };
      case ITEM_STATUS.SOLD:
        return { label: "Sold", variant: "secondary" as const };
      case ITEM_STATUS.ABANDONED:
        return { label: "Abandoned", variant: "destructive" as const };
      default:
        return { label: "Available", variant: "outline" as const };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <Link href={Routes.MEMBER.ITEMS.DETAILS(item.id.toString())} className="h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {image && (
          <div className="relative w-full h-48 flex-shrink-0">
            <Image src={image} alt={itemName} fill className="object-cover" />
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
            <Badge variant={statusBadge.variant} className="mb-2">
              {statusBadge.label}
            </Badge>

            {item.listing_info && (
              <div className="mt-2 text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>{item.listing_info.store_name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
