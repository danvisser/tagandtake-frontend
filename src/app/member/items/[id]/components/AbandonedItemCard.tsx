"use client";

import { Item } from "@src/api/itemsApi";
import { Card, CardContent, CardHeader } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { formatCurrency } from "@src/lib/formatters";
import { formatDate } from "@src/app/listing/[id]/utils/listingHelpers";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@src/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@src/components/ui/dialog";
import { getImageUrl as getCachedImageUrl } from "@src/lib/utils";
import { AlertCircle, Store } from "lucide-react";

interface AbandonedItemCardProps {
  item: Item;
  cacheBust?: number;
}

export default function AbandonedItemCard({ item, cacheBust }: AbandonedItemCardProps) {
  const images = item.images || [];
  const itemName = item.name || "Unknown Item";
  const category = item.category_details?.name || "Unknown";
  const condition = item.condition_details?.condition || "Unknown";
  const price = item.price;
  const description = item.description;
  const size = item.attributes?.size;
  const listingInfo = item.listing_info;

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
                            alt={`${itemName} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            unoptimized
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                        <DialogTitle className="sr-only">{`${itemName} - Image ${index + 1}`}</DialogTitle>
                        <div className="relative w-full aspect-square sm:aspect-[4/3]">
                          <Image
                            src={getCachedImageUrl(image.image_url, cacheBust)}
                            alt={`${itemName} - Image ${index + 1}`}
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
            <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No item image available</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-4 mb-2">
          <h1 className="text-2xl font-medium">{itemName}</h1>
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="destructive" className="px-3 py-1">
                Abandoned
              </Badge>
            </div>
          </div>
        </div>

        <div className="mb-8">
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

          <div className="space-y-4 mb-6">
            {size && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Size</span>
                <span className="font-medium">{size}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Condition</span>
              <span className="font-medium">{condition}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium">{category}</span>
            </div>
          </div>

          <div className="h-px bg-gray-100 mb-6"></div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium">
                {formatCurrency(price)}
              </span>
            </div>
          </div>
        </div>

        {listingInfo && (
          <div className="p-4 bg-gray-50 rounded-lg text-sm border border-gray-100 shadow-sm mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Item abandoned</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-start gap-2">
                    <Store className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {listingInfo.store_name}
                      </p>
                    </div>
                  </div>
                  {listingInfo.abandoned_at && (
                    <p className="text-sm text-muted-foreground">
                      Abandoned on {formatDate(listingInfo.abandoned_at)}
                    </p>
                  )}
                  {listingInfo.reason && (
                    <p className="text-sm text-muted-foreground">
                      Reason: {listingInfo.reason}
                    </p>
                  )}
                  {listingInfo.description && (
                    <p className="text-sm text-muted-foreground">
                      {listingInfo.description}
                    </p>
                  )}
                  {listingInfo.tag_removed !== undefined && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Tag: {listingInfo.tag_removed ? "Removed" : "Still attached"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
