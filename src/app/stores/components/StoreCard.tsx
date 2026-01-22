"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicStore } from "@src/api/storeApi";
import { Card, CardContent } from "@src/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@src/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@src/components/ui/hover-card";
import { Badge } from "@src/components/ui/badge";
import { MapPin, Tag, Shirt, PoundSterling, Percent } from "lucide-react";
import { getCategoryById, getConditionById } from "@src/data/itemReferenceData";
import { formatCurrency } from "@src/lib/formatters";

interface StoreCardProps {
  store: PublicStore;
}

export default function StoreCard({ store }: StoreCardProps) {
  const [openTooltips, setOpenTooltips] = useState<Map<number, boolean>>(new Map());
  
  const toggleTooltip = (id: number) => {
    setOpenTooltips((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, !prev.get(id));
      return newMap;
    });
  };

  // Get category and condition details
  const categories = store.category_ids
    .map((id) => getCategoryById(id))
    .filter((cat) => cat !== undefined);

  const conditions = store.condition_ids
    .map((id) => getConditionById(id))
    .filter((cond) => cond !== undefined);

  return (
    <Card className="w-full overflow-hidden" variant="borderless">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image on the left - responsive width */}
          {store.google_profile_url ? (
            <Link
              href={store.google_profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full md:w-2/5 lg:w-1/3 h-64 md:h-auto min-w-[200px] md:min-w-[250px] flex-shrink-0 cursor-pointer"
            >
              {store.profile_photo_url ? (
                <Image
                  src={store.profile_photo_url}
                  alt={store.store_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </Link>
          ) : (
            <div className="relative w-full md:w-2/5 lg:w-1/3 h-64 md:h-auto min-w-[200px] md:min-w-[250px] flex-shrink-0">
              {store.profile_photo_url ? (
                <Image
                  src={store.profile_photo_url}
                  alt={store.store_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
          )}

          {/* Content on the right */}
          <div className="flex-1 p-4 md:p-6 space-y-3 md:space-y-4">
            {/* Store name */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-semibold">
                {store.store_name}
                {store.distance !== null && store.distance !== undefined && (
                  <span className="text-muted-foreground font-normal">
                    {" "}- {store.distance} km
                  </span>
                )}
              </h3>
            </div>

            {/* Address with Google profile link */}
            {store.store_address && store.google_profile_url && (
              <Link
                href={store.google_profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  {store.store_address.street_address}
                  {store.store_address.city && `, ${store.store_address.city}`}
                  {store.store_address.postal_code && ` ${store.store_address.postal_code}`}
                </span>
              </Link>
            )}
            {store.store_address && !store.google_profile_url && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {store.store_address.street_address}
                  {store.store_address.city && `, ${store.store_address.city}`}
                  {store.store_address.postal_code && ` ${store.store_address.postal_code}`}
                </span>
              </div>
            )}

            {/* Available tags and listings in store - main info */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="flex flex-col items-center gap-2 p-3 md:p-4 lg:p-5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shirt className="h-5 w-5 text-foreground" />
                  <span className="text-foreground text-sm md:text-base">Items Listed</span>
                </div>
                <span className="font-bold text-xl md:text-2xl">{store.active_stock}</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 md:p-4 lg:p-5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-foreground" />
                  <span className="text-foreground text-sm md:text-base">Tags Available</span>
                </div>
                <span className="font-bold text-xl md:text-2xl text-primary">{store.tags_available}</span>
              </div>
            </div>

            {/* Spacer for extra gap after listings */}
            <div className="h-1 md:h-2"></div>

            {/* Minimum Price */}
            <div className="flex justify-between items-center text-sm md:text-sm">
              <div className="flex items-center gap-2">
                <PoundSterling className="h-4 w-4" />
                <span className="font-medium">Minimum Price: </span>
              </div>
              <span className="text-muted-foreground font-medium">{formatCurrency(store.min_price)}</span>
            </div>

            {/* Commission */}
            <div className="flex justify-between items-center text-sm md:text-sm">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                <span className="font-medium">Commission: </span>
              </div>
              <span className="text-muted-foreground font-medium">{store.commission}%</span>
            </div>

            {/* Categories and Conditions with Accordion dropdowns */}
            {(categories.length > 0 || conditions.length > 0) && (
              <div>
                <Accordion type="single" collapsible className="w-full">
                  {conditions.length > 0 && (
                    <AccordionItem value="conditions">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center gap-2">
                          {/* <Info className="h-4 w-4" /> */}
                          <span>Accepted Conditions</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2">
                          <p className="text-sm text-muted-foreground mb-3">
                            Items must meet one of these conditions to be listed:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {conditions.map((condition) => (
                              <HoverCard
                                key={condition.id}
                                open={openTooltips.get(condition.id) || false}
                                onOpenChange={(open) => {
                                  setOpenTooltips((prev) => {
                                    const newMap = new Map(prev);
                                    newMap.set(condition.id, open);
                                    return newMap;
                                  });
                                }}
                              >
                                <HoverCardTrigger asChild>
                                  <Badge
                                    variant="secondary"
                                    className="px-3 py-1 cursor-pointer truncate"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleTooltip(condition.id);
                                    }}
                                  >
                                    {condition.condition}
                                  </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">
                                      {condition.condition}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {condition.description}
                                    </p>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {categories.length > 0 && (
                    <AccordionItem value="categories">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center gap-2">
                          {/* <Tag className="h-4 w-4" /> */}
                          <span>Accepted Categories</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2">
                          <p className="text-sm text-muted-foreground mb-3">
                            Items must belong to one of these categories:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                              <HoverCard
                                key={category.id}
                                open={openTooltips.get(category.id) || false}
                                onOpenChange={(open) => {
                                  setOpenTooltips((prev) => {
                                    const newMap = new Map(prev);
                                    newMap.set(category.id, open);
                                    return newMap;
                                  });
                                }}
                              >
                                <HoverCardTrigger asChild>
                                  <Badge
                                    variant="secondary"
                                    className="px-3 py-1 cursor-pointer truncate"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleTooltip(category.id);
                                    }}
                                  >
                                    {category.name}
                                  </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">
                                      {category.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {category.description}
                                    </p>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

