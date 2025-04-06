import { Button } from "@src/components/ui/button";
import { CheckCircle, Tag, Home, Mail } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@src/lib/formatters";
import { ItemPurchasedResponse } from "@src/api/paymentsApi";

interface SuccessStateProps {
  purchaseData: ItemPurchasedResponse | null;
  onGoHome: () => void;
}

export function SuccessState({ purchaseData, onGoHome }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Clean success header */}
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="bg-green-100 rounded-full p-2 sm:p-3 mb-3 sm:mb-4">
          <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-1 sm:mb-2">
          Payment Successful
        </h2>
      </div>

      {/* Tag removal instruction - Clear call to action */}
      <div className="w-full mb-6 sm:mb-8 bg-blue-50 rounded-lg p-4 sm:p-5 border border-blue-100">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="bg-white rounded-full p-1.5 sm:p-2">
            <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold">
            Action Required: Remove Security Tag
          </h3>
        </div>
        <p className="text-sm sm:text-base text-gray-700 pl-4 sm:pl-11">
          You must show this screen to a staff member to have your security tag
          removed.
        </p>
      </div>

      {/* Item details - Clean and elegant */}
      {purchaseData?.listing?.item_details && (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 sm:mb-8">
          <div className="relative h-36 sm:h-40 md:h-48 w-full">
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
          <div className="p-3 sm:p-4 md:p-6">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">
              {purchaseData.listing.item_details.name || "Item"}
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-500">Price</span>
              <span className="text-base sm:text-lg md:text-xl font-bold">
                {formatCurrency(purchaseData.listing.listing_price || 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Email confirmation - Subtle */}
      <div className="w-full mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="bg-gray-100 rounded-full p-1.5 sm:p-2">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold">Receipt Sent</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 pl-4 sm:pl-11">
          We&apos;ve sent your receipt to your email confirming your purchase.
        </p>
      </div>

      {/* Action button */}
      <div className="w-full">
        <Button
          variant="outline"
          onClick={onGoHome}
          className="h-11 sm:h-12 w-full"
        >
          <Home className="h-4 w-4 mr-2" />
          Return to Home
        </Button>
      </div>
    </div>
  );
}
