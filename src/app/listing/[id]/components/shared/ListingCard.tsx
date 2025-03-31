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
import { formatCurrency } from "@src/lib/formatters";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@src/components/ui/carousel";

interface ListingCardProps {
  title: string;
  price: number;
  condition: string;
  category: string;
  images: { image_url: string; order: number }[];
  statusMessage?: string;
  statusBadge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  footerContent?: ReactNode;
}

export default function ListingCard({
  title,
  price,
  condition,
  category,
  images,
  statusMessage,
  statusBadge,
  footerContent,
}: ListingCardProps) {
  return (
    <Card className="w-full overflow-hidden" variant="borderless">
      <CardHeader className="p-0">
        <div className="relative w-full h-64">
          {images && images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-64">
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
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="text-xl font-bold">{formatCurrency(price)}</div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{condition}</Badge>
          <Badge variant="outline">{category}</Badge>
          {statusBadge && (
            <Badge variant={statusBadge.variant || "default"}>
              {statusBadge.label}
            </Badge>
          )}
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
            {statusMessage}
          </div>
        )}
      </CardContent>

      {footerContent && (
        <CardFooter className="px-6 py-4 border-t">{footerContent}</CardFooter>
      )}
    </Card>
  );
}
