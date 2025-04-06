import { Button } from "@src/components/ui/button";
import { CheckCircle, Tag, Home } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@src/lib/formatters";
import { ItemPurchasedResponse } from "@src/api/paymentsApi";

interface SuccessStateProps {
  purchaseData: ItemPurchasedResponse | null;
  onGoHome: () => void;
}

export function SuccessState({
  purchaseData,
  onGoHome,
}: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Success message */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
        Purchase Successful
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Your purchase has been confirmed. You can now remove the tag from your
        item.
      </p>

      {/* Item details - Mobile optimized */}
      {purchaseData?.listing?.item_details && (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 sm:mb-8">
          <div className="relative h-40 sm:h-48 w-full">
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
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              {purchaseData.listing.item_details.name || "Item"}
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Price</span>
              <span className="text-lg sm:text-xl font-bold">
                {formatCurrency(purchaseData.listing.listing_price || 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tag removal instructions - Prominent for mobile */}
      <div className="w-full bg-amber-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-amber-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white rounded-full p-1.5">
            <Tag className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold">Remove Your Tag</h3>
        </div>
        <p className="text-base text-gray-700 mb-3">
          Please take your item to a store staff member to have the tag removed.
        </p>
        <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-amber-100">
          <div className="bg-amber-50 rounded-full p-1 mt-1">
            <CheckCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="font-medium">Show this screen to staff</p>
            <p className="text-sm text-gray-600">
              They&apos;ll remove the tag for you
            </p>
          </div>
        </div>
      </div>

      {/* Email confirmation */}
      <div className="w-full bg-blue-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-white rounded-full p-1 mt-1">
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Check your email for details</p>
              <p className="text-sm text-gray-600">
                We&apos;ve sent you a confirmation email with your purchase
                details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons - Mobile optimized */}
      <div className="flex flex-col gap-3 w-full">
        <Button
          variant="outline"
          onClick={onGoHome}
          className="h-12 w-full"
        >
          <Home className="h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
}
