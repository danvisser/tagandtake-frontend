"use client";

import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { Badge } from "@src/components/ui/badge";
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
import { VacantTag } from "@src/api/listingsApi";
import { CalendarDays, Tag, Info, Store, CheckCircle2 } from "lucide-react";

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
}

export default function VacantTagCard({
  listing,
  statusBadge,
  footerContent,
}: VacantTagCardProps) {
  // Extract properties from the vacant tag
  const {
    min_listing_days,
    store_commission,
    store_conditions,
    store_categories,
  } = listing;

  // Calculate total commission percentage

  return (
    <Card className="w-full overflow-hidden" variant="borderless">
      <CardHeader className="p-0">
        <div className="relative w-full h-[300px] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <div className="text-center p-8">
            <Tag className="h-16 w-16 mx-auto text-primary/60 mb-4" />
            <h2 className="text-2xl font-medium text-primary/80">Vacant Tag</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              This tag is available for listing your item
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-4 mb-2">
          <CardTitle className="text-2xl font-medium">
            Store Listing Information
          </CardTitle>
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

        {/* Key information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Minimum Listing Period</h3>
              <p className="text-sm text-muted-foreground">
                {min_listing_days} {min_listing_days === 1 ? "day" : "days"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Store className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Store Commission</h3>
              <p className="text-sm text-muted-foreground">
                {store_commission}% of the sale
              </p>
            </div>
          </div>
        </div>

        {/* Store conditions and categories */}
        <Accordion type="single" collapsible className="w-full mb-8">
          <AccordionItem value="conditions">
            <AccordionTrigger className="text-base">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>Accepted Conditions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Items must meet one of these conditions to be listed:
                </p>
                <div className="flex flex-wrap gap-2">
                  {store_conditions.map((sc, index) => (
                    <HoverCard key={index}>
                      <HoverCardTrigger asChild>
                        <Badge
                          variant="outline"
                          className="px-3 py-1 cursor-pointer"
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
                <span>Accepted Categories</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Items must belong to one of these categories:
                </p>
                <div className="flex flex-wrap gap-2">
                  {store_categories.map((sc, index) => (
                    <HoverCard key={index}>
                      <HoverCardTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 cursor-pointer"
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
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Refined Listing Guidelines */}
        <div className="space-y-4 mb-6 bg-slate-50 border border-slate-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-5 w-5 text-primary" />
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
                Items will be displayed for at least {min_listing_days}{" "}
                {min_listing_days === 1 ? "day" : "days"} - after which the
                store has the right to recall.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary/70 mt-0.5 flex-shrink-0" />
              <span>
                Items can be collected at any time by visiting the store.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary/70 mt-0.5 flex-shrink-0" />
              <span>
                Items not collected within 10 days after recall will be
                considered abandoned.
              </span>
            </li>
          </ul>
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
