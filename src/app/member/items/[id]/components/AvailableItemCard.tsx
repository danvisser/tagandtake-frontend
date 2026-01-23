"use client";

import { Item } from "@src/api/itemsApi";
import { Card, CardContent, CardHeader } from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
import { formatCurrency } from "@src/lib/formatters";
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
import { Button } from "@src/components/ui/button";
import { Routes } from "@src/constants/routes";
import { getImageUrl as getCachedImageUrl } from "@src/lib/utils";
import Link from "next/link";

interface AvailableItemCardProps {
  item: Item;
  onEditItem: () => void;
  cacheBust?: number;
}

export default function AvailableItemCard({ item, onEditItem, cacheBust }: AvailableItemCardProps) {
  const images = item.images || [];
  const itemName = item.name || "Unknown Item";
  const category = item.category_details?.name || "Unknown";
  const condition = item.condition_details?.condition || "Unknown";
  const price = item.price;
  const description = item.description;
  const size = item.attributes?.size;

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
              <Badge variant="secondary" className="px-3 py-1">
                Available
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

        <div className="mt-8 space-y-3">
          <Button onClick={onEditItem} variant="outline" className="w-full">
            Edit Item
          </Button>
          <div className="h-px bg-gray-100 mb-6"></div>
          <Link href={Routes.STORES.ROOT}>
            <Button className="w-full">Find a Store</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
