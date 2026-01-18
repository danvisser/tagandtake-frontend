"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@src/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@src/components/ui/dialog";
import { formatCurrency } from "@src/lib/formatters";
import { getImageUrl as getCachedImageUrl } from "@src/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@src/components/ui/carousel";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
} from "@src/api/listingsApi";
import { Info } from "lucide-react";

// Define the StatusMessageContent interface
interface StatusMessageContent {
  icon: ReactNode;
  mainText: string;
  secondaryText?: string;
  additionalInfo?: string;
}

interface ListingCardProps {
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing;
  statusMessage?: ReactNode | StatusMessageContent;
  statusBadge?: {
    label: string;
    variant?:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "secondary-inverse"
      | "destructive-inverse";
  };
  footerContent?: ReactNode;
}

export default function ListingCard({
  listing,
  statusMessage,
  statusBadge,
  footerContent,
}: ListingCardProps) {
  const [cacheBust] = useState(() => Date.now());
  const item = "item_details" in listing ? listing.item_details : null;
  const title = item?.name || "Vacant Tag";
  const item_price = "item_price" in listing ? listing.item_price : 0;
  const listing_price = "listing_price" in listing ? listing.listing_price : 0;
  const condition = item?.condition_details?.condition || "Unknown";
  const conditionDescription = item?.condition_details?.description;
  const category = item?.category_details?.name || "Unknown";
  const categoryDescription = item?.category_details?.description;
  const size = item?.size;
  const description = item?.description;
  const images = item?.images || [];

  return (
    <Card className="w-full overflow-hidden" variant="borderless">
      <CardHeader className="p-0">
        <div className="relative w-full h-full">
          {images && images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={`${image.image_url}-${image.order ?? index}`}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="relative w-full h-[400px] cursor-pointer">
                          <Image
                            src={getCachedImageUrl(image.image_url, cacheBust)}
                            alt={`${title} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            unoptimized
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                        <DialogTitle className="sr-only">{`${title} - Image ${index + 1}`}</DialogTitle>
                        <div className="relative w-full aspect-square sm:aspect-[4/3]">
                          <Image
                            src={getCachedImageUrl(image.image_url, cacheBust)}
                            alt={`${title} - Image ${index + 1}`}
                            fill
                            className="object-contain"
                            priority
                            unoptimized
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No item image available</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-4 mb-2">
          <CardTitle className="text-2xl font-medium">{title}</CardTitle>
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {statusBadge && (
                <Badge
                  variant={statusBadge.variant || "default"}
                  className="px-3 py-1"
                >
                  {statusBadge.label}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Clean, beautiful item details */}
        <div className="mb-8">
          {/* Description with refined typography */}
          {description && (
            <div className="mb-8 space-y-1.5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Description
              </p>
              <p className="text-base leading-relaxed text-foreground">
                {description}
              </p>
            </div>
          )}

          {/* Item details in a clean, elegant layout */}
          <div className="space-y-4 mb-6">
            {size && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Size</span>
                <span className="font-medium">{size}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Condition</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{condition}</span>
                {conditionDescription && (
                  <HoverCard>
                    <HoverCardTrigger className="cursor-default">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">{condition}</h4>
                        <p className="text-sm text-muted-foreground">
                          {conditionDescription}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Category</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{category}</span>
                {categoryDescription && (
                  <HoverCard>
                    <HoverCardTrigger className="cursor-default">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">{category}</h4>
                        <p className="text-sm text-muted-foreground">
                          {categoryDescription}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
            </div>
          </div>

          {/* Subtle separator */}
          <div className="h-px bg-gray-100 mb-6"></div>

          {/* Simplified price information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">
                {formatCurrency(item_price)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-medium">
                  {formatCurrency(listing_price)}
                </span>
                <HoverCard>
                  <HoverCardTrigger className="cursor-default">
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        A service fee of 10% of the item price plus £1 helps us
                        provide this service.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="p-4 bg-gray-50 rounded-lg text-sm border border-gray-100 shadow-sm">
            {typeof statusMessage === "object" && "icon" in statusMessage ? (
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0">{statusMessage.icon}</div>
                <div>
                  <p className="font-medium">{statusMessage.mainText}</p>
                  {statusMessage.secondaryText && (
                    <p className="text-sm text-muted-foreground">
                      {statusMessage.secondaryText}
                    </p>
                  )}
                  {statusMessage.additionalInfo && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {statusMessage.additionalInfo}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              statusMessage
            )}
          </div>
        )}
      </CardContent>

      {footerContent && (
        <CardFooter className="px-8 py-6 border-t border-gray-100">
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
}
