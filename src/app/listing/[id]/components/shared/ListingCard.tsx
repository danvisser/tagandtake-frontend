"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@src/components/ui/carousel";
import { cn } from "@src/lib/utils";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
} from "@src/api/listingsApi";
import { formatCurrency } from "@src/lib/formatters";
import { LISTING_ROLES, ListingRole } from "@src/types/roles";

// Type for all possible listing types
type ListingType =
  | ItemListing
  | RecalledItemListing
  | AbandonedItemListing
  | SoldItemListing;

interface ListingCardProps {
  listing: ListingType;
  userRole?: ListingRole;
  statusMessage?: React.ReactNode;
  className?: string;
  footerContent?: React.ReactNode;
}

export default function ListingCard({
  listing,
  userRole = LISTING_ROLES.VIEWER, 
  statusMessage,
  className,
  footerContent,
}: ListingCardProps) {
  const item = listing.item_details;

  const isRecalled = "reason" in listing && "recalled_at" in listing;
  const isAbandoned = "reason" in listing && "abandoned_at" in listing;
  const isSold = "sold_at" in listing;

  const images = item?.images || [];

  const isOwner = userRole === LISTING_ROLES.OWNER;
  const isHost = userRole === LISTING_ROLES.HOST;
  

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Image carousel */}
      {images.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square w-full">
                  <Image
                    src={image.image_url}
                    alt={`${item?.name || "Item"} image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      ) : (
        <div className="relative aspect-square w-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No image available</p>
        </div>
      )}

      {/* Listing details */}
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg line-clamp-1">{item?.name}</h3>
          <Badge
            variant={
              isRecalled
                ? "destructive"
                : isAbandoned
                  ? "outline"
                  : isSold
                    ? "secondary"
                    : "default"
            }
          >
            {formatCurrency(listing.listing_price)}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {item?.category_details && <span>{item.category_details.name}</span>}
          {item?.condition_details && (
            <span>• {item.condition_details.condition}</span>
          )}
          {item?.size && <span>• {item.size}</span>}
        </div>

        {/* Owner-specific information */}
        {isOwner && (
          <div className="text-sm pt-1">
            <div className="flex justify-between">
              <span>Store commission:</span>
              <span>{listing.store_commission}%</span>
            </div>
            <div className="flex justify-between">
              <span>Your earnings:</span>
              <span className="font-medium">
                {formatCurrency(listing.member_earnings)}
              </span>
            </div>
          </div>
        )}

        {/* Host-specific information */}
        {isHost && (
          <div className="text-sm pt-1">
            <div className="flex justify-between">
              <span>Commission earned:</span>
              <span className="font-medium">
                {formatCurrency(listing.store_commission_amount)}
              </span>
            </div>
            {/* Other host-specific details */}
          </div>
        )}

        {/* Viewer-only information (non-owners, non-hosts) */}
        {!isOwner && !isHost && (
          <div className="text-sm pt-1">
            <div className="flex justify-between">
              <span>Price includes all fees</span>
            </div>
            {/* Other viewer-specific details */}
          </div>
        )}

        {/* Status message */}
        {statusMessage && (
          <div className="mt-2 pt-2 border-t text-sm">{statusMessage}</div>
        )}
      </CardContent>

      {/* Optional footer content */}
      {footerContent && (
        <CardFooter className="p-4 pt-0">{footerContent}</CardFooter>
      )}
    </Card>
  );
}
