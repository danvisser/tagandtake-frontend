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
  const mainImage = images && images.length > 0 ? images[0].image_url : null;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-64">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
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
