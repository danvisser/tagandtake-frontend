"use client";

import { ReactNode, useState } from "react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@src/components/ui/accordion";
import { VacantTag } from "@src/api/listingsApi";
import { CalendarDays, Tag, Info, Store, CheckCircle2 } from "lucide-react";
import { ListingRole, ListingRoles } from "@src/types/roles";

interface VacantTagCardProps {
  listing: VacantTag;
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
  userRole?: ListingRole | null;
}

export default function VacantTagCard({
  listing,
  footerContent,
  userRole = ListingRoles.VIEWER,
}: VacantTagCardProps) {
  const [openTooltips, setOpenTooltips] = useState<Map<number, boolean>>(new Map());
  
  const toggleTooltip = (index: number) => {
    setOpenTooltips((prev) => {
      const newMap = new Map(prev);
      newMap.set(index, !prev.get(index));
      return newMap;
    });
  };

  // Extract properties from the vacant tag
  const {
    min_listing_days,
    store_commission,
    store_conditions,
    store_categories,
    has_capacity,
    min_price,
  } = listing;

  // Determine if guidelines should be shown
  const showGuidelines = userRole !== ListingRoles.HOST;

  // Determine the header background color based on capacity
  const headerBgClass = has_capacity
    ? "bg-gradient-to-br from-primary/10 to-primary/5"
    : "bg-gradient-to-br from-destructive/10 to-destructive/5";

  // Determine the icon color based on capacity
  const iconColorClass = has_capacity
    ? "text-primary/60"
    : "text-destructive/60";

  // Determine the title color based on capacity
  const titleColorClass = has_capacity
    ? "text-primary/80"
    : "text-destructive/80";

  return (
    <Card className="w-full overflow-hidden" variant="borderless">
      <CardHeader className="p-0">
        <div
          className={`relative w-full h-[200px] md:h-[300px] ${headerBgClass} flex items-center justify-center`}
        >
          <div className="text-center p-4 md:p-8">
            <Tag
              className={`h-12 w-12 md:h-16 md:w-16 mx-auto ${iconColorClass} mb-2 md:mb-4`}
            />
            <h2
              className={`text-xl md:text-2xl font-medium ${titleColorClass}`}
            >
              {has_capacity ? "Vacant Tag" : "Store at Capacity"}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm md:text-base">
              {has_capacity
                ? "This tag is available for listing your item"
                : "This store is currently not accepting new listings"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-8">
        <div className="space-y-2 mb-2">
          <CardTitle className="text-lg font-medium mb-2">
            Listing Information:
          </CardTitle>
          <div>
            <div className="flex flex-wrap gap-2 mb-2"></div>
          </div>
        </div>

        {/* Key information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <CalendarDays className="h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Guaranteed Display Period</h3>
              <p className="text-sm text-muted-foreground">
                {min_listing_days} {min_listing_days === 1 ? "day" : "days"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <Store className="h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Store Commission</h3>
              <p className="text-sm text-muted-foreground">
                {store_commission}% of the sale
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <Tag className="h-5 w-5  mt-0.5" />
            <div>
              <h3 className="font-medium">Minimum Price</h3>
              <p className="text-sm text-muted-foreground">
                £{min_price?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Categories and Conditions - More prominent display */}
        <div className="mb-10 mt-10">
          <h3 className="text-lg font-medium mb-2">What we accept:</h3>
          <Accordion type="single" collapsible className="w-full pl-2 pr-2">
            <AccordionItem value="conditions">
              <AccordionTrigger className="text-base">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Item Conditions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    Items must meet one of these conditions to be listed:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {store_conditions.map((sc, index) => (
                      <HoverCard
                        key={index}
                        open={openTooltips.get(index) || false}
                        onOpenChange={(open) => {
                          setOpenTooltips((prev) => {
                            const newMap = new Map(prev);
                            newMap.set(index, open);
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
                              toggleTooltip(index);
                            }}
                          >
                            {sc.condition.condition}
                          </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">
                              {sc.condition.condition}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {sc.condition.description ||
                                `Items in ${sc.condition.condition} condition are accepted for listing.`}
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="categories">
              <AccordionTrigger className="text-base">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>Item Categories</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    Items must belong to one of these categories:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {store_categories.map((sc, index) => {
                      const categoryIndex = store_conditions.length + index;
                      return (
                        <HoverCard
                          key={index}
                          open={openTooltips.get(categoryIndex) || false}
                          onOpenChange={(open) => {
                            setOpenTooltips((prev) => {
                              const newMap = new Map(prev);
                              newMap.set(categoryIndex, open);
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
                                toggleTooltip(categoryIndex);
                              }}
                            >
                              {sc.category.name}
                            </Badge>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">
                                {sc.category.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {sc.category.description ||
                                  `Items in the ${sc.category.name} category are accepted for listing.`}
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Refined Listing Guidelines - Only show for HOST role */}
        {showGuidelines && (
          <div className="space-y-4 mb-6 bg-slate-50  rounded-lg p-4 md:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-destructive/60" />
              <h3 className="font-medium text-base">Listing Guidelines</h3>
            </div>
            <p className="text-sm font-medium text-foreground mb-3">
              Please review these guidelines before listing your item:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary/70 mt-0.5 flex-shrink-0" />
                <span>All items must be clean.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary/70 mt-0.5 flex-shrink-0" />
                <span>
                  The host store will take a {store_commission}% commission on
                  the sale of your item.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary/70 mt-0.5 flex-shrink-0" />
                <span>
                  You can collect your item at any time by visiting the store.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary/70 mt-0.5 flex-shrink-0" />
                <span>
                  Your item will be displayed for at least {min_listing_days}{" "}
                  {min_listing_days === 1 ? "day" : "days"} before the store may
                  rotate its stock.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary/70 mt-0.5 flex-shrink-0" />
                <span>
                  If you don&apos;t collect your item within 10 days after a
                  recall, it will be considered a donation to charity.
                  We&apos;ll send you daily reminders to help you collect it on
                  time.
                </span>
              </li>
            </ul>
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
