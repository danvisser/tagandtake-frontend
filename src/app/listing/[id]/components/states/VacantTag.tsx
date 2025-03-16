"use client";

import { ListingRole } from "@src/types/roles";
import { Card, CardContent, CardFooter } from "@src/components/ui/card";
import ListingActions from "../shared/ListingActions";

interface VacantTagProps {
  tagId: number;
  userRole: ListingRole;
}

export default function VacantTag({ tagId, userRole }: VacantTagProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-2">
        <div className="relative aspect-square w-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No listing available</p>
        </div>

        <div className="pt-4">
          <h3 className="font-medium text-lg">Tag #{tagId}</h3>
          <p className="text-sm text-muted-foreground">
            This tag is not currently associated with any listing.
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <ListingActions listing={null} userRole={userRole} />
      </CardFooter>
    </Card>
  );
}
