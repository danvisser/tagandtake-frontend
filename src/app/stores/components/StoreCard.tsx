"use client";

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
import { MapPin, Tag, Shirt } from "lucide-react";
import { getCategoryById, getConditionById } from "@src/data/itemReferenceData";
import { formatCurrency } from "@src/lib/formatters";

interface StoreCardProps {
  store: PublicStore;
}

export default function StoreCard({ store }: StoreCardProps) {
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

          {/* Content on the right */}
          <div className="flex-1 p-6 space-y-4">
            {/* Store name and Google link */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-semibold">
                {store.store_name}
                {store.distance !== null && store.distance !== undefined && (
                  <span className="text-muted-foreground font-normal">
                    {" "}- {store.distance} km
                  </span>
                )}
              </h3>
              {store.google_profile_url && (
                <Link
                  href={store.google_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="View store on Google"
                >
                  <MapPin className="h-5 w-5" />
                </Link>
              )}
            </div>

            {/* Address */}
            {store.store_address && (
              <div className="text-sm text-muted-foreground">
                <p>
                  {store.store_address.street_address}
                  {store.store_address.city && `, ${store.store_address.city}`}
                  {store.store_address.postal_code && ` ${store.store_address.postal_code}`}
                </p>
              </div>
            )}

            {/* Available tags and listings in store - main info */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 pt-2">
              <div className="flex flex-col items-center gap-2 p-3 md:p-4 lg:p-5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-foreground" />
                  <span className="text-foreground text-sm md:text-base">Available</span>
                </div>
                <span className="font-bold text-2xl md:text-3xl text-primary">{store.remaining_stock}</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 md:p-4 lg:p-5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shirt className="h-5 w-5 text-foreground" />
                  <span className="text-foreground text-sm md:text-base">Listings</span>
                </div>
                <span className="font-bold text-2xl md:text-3xl">{store.active_stock}</span>
              </div>
            </div>

            {/* Categories and Conditions with Accordion dropdowns */}
            {(categories.length > 0 || conditions.length > 0) && (
              <div className="pt-1">
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
                              <HoverCard key={condition.id}>
                                <HoverCardTrigger asChild>
                                  <Badge
                                    variant="secondary"
                                    className="px-3 py-1 cursor-pointer truncate"
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
                              <HoverCard key={category.id}>
                                <HoverCardTrigger asChild>
                                  <Badge
                                    variant="secondary"
                                    className="px-3 py-1 cursor-pointer truncate"
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

            {/* Store details - in boxes with shorter labels */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="flex items-start gap-2 p-2 md:p-3 lg:p-3 bg-slate-50 rounded-lg">
                {/* <Tag className="h-4 w-4 mt-0.5 flex-shrink-0" /> */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-xs md:text-sm">Min Price</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(store.min_price)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 md:p-3 lg:p-3 bg-slate-50 rounded-lg">
                {/* <Store className="h-4 w-4 mt-0.5 flex-shrink-0" /> */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-xs md:text-sm">Commission</h3>
                  <p className="text-sm text-muted-foreground">
                    {store.commission}%
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 md:p-3 lg:p-3 bg-slate-50 rounded-lg">
                {/* <CalendarDays className="h-4 w-4 mt-0.5 flex-shrink-0" /> */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-xs md:text-sm">Display</h3>
                  <p className="text-sm text-muted-foreground">
                    {store.min_listing_days} {store.min_listing_days === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

