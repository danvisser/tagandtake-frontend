"use client";

import { ReactNode } from "react";
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
import { formatCurrency } from "@src/lib/formatters";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@src/components/ui/carousel";
import { StoreCondition, StoreCategory} from '@src/api/listingsApi'

interface ListingCardProps {
  title: string;
  item_price: number;
  listing_price: number;
  condition: string;
  conditionDescription?: string;
  category: string;
  categoryDescription?: string;
  size?: string;
  description?: string;
  store_commission?: number;
  store_conditions?: StoreCondition[]
  store_categories?: StoreCategory[]
  images: { image_url: string; order: number }[];
  statusMessage?: ReactNode;
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
  title,
  item_price,
  listing_price,
  condition,
  conditionDescription,
  category,
  categoryDescription,
  size,
  description,
  images,
  statusMessage,
  statusBadge,
  footerContent,
}: ListingCardProps) {
  return (
    <Card className="w-full overflow-hidden" variant="borderless">
      <CardHeader className="p-0">
        <div className="relative w-full h-[400px]">
          {images && images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-[400px]">
                      <Image
                        src={image.image_url}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
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
              <span className="text-gray-400">No image available</span>
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

        {/* System-set content */}
        <div className="space-y-3 mb-8 text-sm border-b border-gray-300 pb-6">
          <HoverCard>
            <div className="flex items-center gap-2">
              <span className="font-medium">Condition:</span>
              <HoverCardTrigger className="cursor-pointer">
                <span className="text-muted-foreground">{condition}</span>
              </HoverCardTrigger>
            </div>
            {conditionDescription && (
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{condition}</h4>
                  <p className="text-sm text-muted-foreground">
                    {conditionDescription}
                  </p>
                </div>
              </HoverCardContent>
            )}
          </HoverCard>

          <HoverCard>
            <div className="flex items-center gap-2">
              <span className="font-medium">Category:</span>
              <HoverCardTrigger className="cursor-pointer">
                <span className="text-muted-foreground">{category}</span>
              </HoverCardTrigger>
            </div>
            {categoryDescription && (
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{category}</h4>
                  <p className="text-sm text-muted-foreground">
                    {categoryDescription}
                  </p>
                </div>
              </HoverCardContent>
            )}
          </HoverCard>
        </div>

        {/* User-set content */}
        <div className="space-y-6">
          {size && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Size:</span>
              <span className="text-muted-foreground">{size}</span>
            </div>
          )}

          {description && (
            <div className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </div>
          )}

          <div className="pt-2">
            <div className="text-2xl font-medium">
              {formatCurrency(item_price)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(listing_price)} incl. fees
            </div>
          </div>

          {statusMessage && (
            <div className="p-4 bg-gray-50 rounded-lg text-sm border border-gray-100">
              {statusMessage}
            </div>
          )}
        </div>
      </CardContent>

      {footerContent && (
        <CardFooter className="px-8 py-6 border-t border-gray-100">
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
}
