"use client";

import { useParams } from "next/navigation";
import { useListingData } from "@src/app/listing/[id]/hooks/useListingData";
import { useListingActions } from "@src/app/listing/[id]/hooks/useListingActions";
import WithListingState from "@src/app/listing/[id]/components/withListingState";
import ListingNavigation from "@src/app/listing/[id]/components/shared/ListingNavigation";
import LoadingSpinner from "@src/components/LoadingSpinner";
import {
  ListingProvider,
  useListingContext,
} from "@src/app/listing/[id]/context/ListingContext";
import CollectionModal from "@src/app/listing/[id]/components/modals/CollectionModal";
import ListItemModal from "@src/app/listing/[id]/components/modals/ListItemModal";
import CheckoutModal from "@src/app/listing/[id]/components/modals/CheckoutModal";
import SuccessModal from "@src/app/listing/[id]/components/modals/SuccessModal";
import RemoveTagConfirmationModal from "@src/app/listing/[id]/components/modals/RemoveTagConfirmationModal";
import TagNotFound from "@src/app/listing/[id]/components/states/TagNotFound";

// Inner component that uses the context
function ListingContent() {
  const { id } = useParams();
  const listingId = typeof id === "string" ? parseInt(id) : 0;
  const { listing, userRole, isLoading, error } = useListingData();
  const {
    isCollectionModalOpen,
    setIsCollectionModalOpen,
    isListItemModalOpen,
    setIsListItemModalOpen,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    isRemoveTagFromAbandonedModalOpen,
    setIsRemoveTagFromAbandonedModalOpen,
    isRemoveTagFromSoldModalOpen,
    setIsRemoveTagFromSoldModalOpen,
    isCollectionSuccessModalOpen,
    setIsCollectionSuccessModalOpen,
    isRemoveTagSuccessModalOpen,
    setIsRemoveTagSuccessModalOpen,
    actions,
  } = useListingContext();

  // Handler for confirming collection
  const handleCollectConfirm = async (pin: string) => {
    try {
      await actions.handleCollect(pin);
      setIsCollectionModalOpen(false);
      setIsCollectionSuccessModalOpen(true);
    } catch (error) {
      console.error("Error collecting item:", error);
    }
  };

  // Handler for confirming tag removal from abandoned listing
  const handleRemoveTagFromAbandonedConfirm = async () => {
    try {
      await actions.handleRemoveTagFromAbandoned();
      setIsRemoveTagFromAbandonedModalOpen(false);
      setIsRemoveTagSuccessModalOpen(true);
    } catch (error) {
      console.error("Error removing tag from abandoned listing:", error);
    }
  };

  // Handler for confirming tag removal from sold listing
  const handleRemoveTagFromSoldConfirm = async () => {
    try {
      await actions.handleRemoveTagFromSold();
      setIsRemoveTagFromSoldModalOpen(false);
      setIsRemoveTagSuccessModalOpen(true);
    } catch (error) {
      console.error("Error removing tag from sold listing:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="md" text="Loading listing..." />
      </div>
    );
  }

  if (error) {
    return <TagNotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <ListingNavigation userRole={userRole} />

      <WithListingState listing={listing} userRole={userRole} />

      {/* Modals */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onCollect={handleCollectConfirm}
        isLoading={actions.isCollectLoading}
      />

      <ListItemModal
        isOpen={isListItemModalOpen}
        onClose={() => setIsListItemModalOpen(false)}
        tagId={listingId}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        listingId={listingId}
      />

      {/* Confirmation Modals */}
      <RemoveTagConfirmationModal
        isOpen={isRemoveTagFromAbandonedModalOpen}
        onClose={() => setIsRemoveTagFromAbandonedModalOpen(false)}
        onConfirm={handleRemoveTagFromAbandonedConfirm}
        title="Remove Tag from Abandoned Listing"
        description="Are you sure you want to remove this tag from the abandoned listing? This will free up the tag for future use."
        confirmButtonText="Remove Tag"
        isLoading={actions.isRemoveTagLoading}
        variant="abandoned"
      />

      <RemoveTagConfirmationModal
        isOpen={isRemoveTagFromSoldModalOpen}
        onClose={() => setIsRemoveTagFromSoldModalOpen(false)}
        onConfirm={handleRemoveTagFromSoldConfirm}
        title="Remove Tag from Sold Listing"
        description=""
        confirmButtonText="Remove Tag"
        isLoading={actions.isRemoveTagLoading}
        variant="sold"
      />

      {/* Success Modals */}
      <SuccessModal
        isOpen={isCollectionSuccessModalOpen}
        onClose={() => setIsCollectionSuccessModalOpen(false)}
        title="Item Collected Successfully"
        description="The item has been successfully collected."
        buttonText="Done"
        shouldRefresh={true}
      />

      <SuccessModal
        isOpen={isRemoveTagSuccessModalOpen}
        onClose={() => setIsRemoveTagSuccessModalOpen(false)}
        title="Tag Removed Successfully"
        description="The tag has been successfully removed from the listing."
        buttonText="Done"
        shouldRefresh={true}
      />
    </div>
  );
}

// Main container component that provides the context
export default function ListingContainer() {
  const { id } = useParams();
  const listingId = typeof id === "string" ? parseInt(id) : 0;
  const actions = useListingActions(listingId);

  return (
    <ListingProvider actions={actions}>
      <ListingContent />
    </ListingProvider>
  );
}
