import { Button } from "@src/components/ui/button";
import { CheckCircle, Tag, Home, Mail } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@src/lib/formatters";
import { ItemPurchasedResponse } from "@src/api/paymentsApi";
import { Alert, AlertDescription, AlertTitle } from "@src/components/ui/alert";

interface SuccessStateProps {
  purchaseData: ItemPurchasedResponse | null;
  onGoHome: () => void;
}

export function SuccessState({ purchaseData, onGoHome }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Clean success header */}
      <div className="flex flex-col items-center mb-6">
        <div className="rounded-full p-2 mb-3">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-xl text-center mb-1">Payment Successful</h2>
      </div>

      {/* Tag removal instruction - Clear call to action */}
      <Alert className="w-full mb-6 border-primary/20 bg-primary/5 py-4">
        <Tag className="h-5 w-5 text-primary" />
        <div>
          <AlertTitle className="text-base">
            Please remove the tag
          </AlertTitle>
          <AlertDescription className="text-muted-foreground">
            <p className="text-sm font-medium text-foreground">
              Take the item to a member of staff to remove the tag.
            </p>
          </AlertDescription>
        </div>
      </Alert>

      {/* Item details - Clean and elegant */}
      {purchaseData?.listing?.item_details && (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="relative h-36 w-full">
            <Image
              src={
                purchaseData.listing.item_details.main_image ||
                (purchaseData.listing.item_details.images &&
                  purchaseData.listing.item_details.images.length > 0
                  ? purchaseData.listing.item_details.images[0].image_url
                  : "")
              }
              alt={purchaseData.listing.item_details.name || "Item"}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-3">
            <h3 className="text-base font-semibold mb-2">
              {purchaseData.listing.item_details.name || "Item"}
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-base text-muted-foreground">Price</span>
              <span className="text-base">
                {formatCurrency(purchaseData.listing.listing_price || 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Email confirmation - Subtle */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-gray-100 rounded-full p-1.5">
            <Mail className="h-4 w-4 text-gray-500" />
          </div>
          <h3 className="text-base font-semibold">Receipt Sent</h3>
        </div>
        <p className="text-sm text-muted-foreground pl-9">
          A receipt has been sent to your email confirming your purchase.
        </p>
      </div>

      {/* Action button */}
      <div className="w-full">
        <Button onClick={onGoHome} className="h-11 w-full">
          <Home className="h-4 w-4 mr-2" />
          Return to Home
        </Button>
      </div>
    </div>
  );
}
