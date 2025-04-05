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
    isRemoveTagFromAbandonedModalOpen,
    setIsRemoveTagFromAbandonedModalOpen,
    isRemoveTagFromSoldModalOpen,
    setIsRemoveTagFromSoldModalOpen,
    isCollectionSuccessModalOpen,
    setIsCollectionSuccessModalOpen,
    isRemoveTagSuccessModalOpen,
    setIsRemoveTagSuccessModalOpen,
    // Error states
    collectionError,
    setCollectionError,
    removeTagError,
    setRemoveTagError,
  } = useListingContext();

  // Use the actions from the context
  const actions = useListingContext().actions;

  // Handler for confirming collection
  const handleCollectConfirm = async (pin: string) => {
    try {
      // Clear any previous errors
      setCollectionError(null);

      const result = await actions.handleCollect(pin);

      if (result.success) {
        setIsCollectionModalOpen(false);
        setIsCollectionSuccessModalOpen(true);
      } else {
        // Set the error in the context
        setCollectionError(result.error);
      }
    } catch (error) {
      console.error("Error collecting item:", error);
      setCollectionError(
        "An unexpected error occurred while collecting the item."
      );
    }
  };

  // Handler for confirming tag removal from abandoned listing
  const handleRemoveTagFromAbandonedConfirm = async () => {
    try {
      // Clear any previous errors
      setRemoveTagError(null);

      const result = await actions.handleRemoveTagFromAbandoned();

      if (result.success) {
        setIsRemoveTagFromAbandonedModalOpen(false);
        setIsRemoveTagSuccessModalOpen(true);
      } else {
        // Set the error in the context
        setRemoveTagError(result.error);
      }
    } catch (error) {
      console.error("Error removing tag from abandoned listing:", error);
      setRemoveTagError("An unexpected error occurred while removing the tag.");
    }
  };

  // Handler for confirming tag removal from sold listing
  const handleRemoveTagFromSoldConfirm = async () => {
    try {
      // Clear any previous errors
      setRemoveTagError(null);

      const result = await actions.handleRemoveTagFromSold();

      if (result.success) {
        setIsRemoveTagFromSoldModalOpen(false);
        setIsRemoveTagSuccessModalOpen(true);
      } else {
        // Set the error in the context
        setRemoveTagError(result.error);
      }
    } catch (error) {
      console.error("Error removing tag from sold listing:", error);
      setRemoveTagError("An unexpected error occurred while removing the tag.");
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
        onClose={() => {
          setIsCollectionModalOpen(false);
          setCollectionError(null); // Clear error when closing
        }}
        onCollect={handleCollectConfirm}
        isLoading={actions.isCollectLoading}
        error={collectionError}
      />

      <ListItemModal
        isOpen={isListItemModalOpen}
        onClose={() => setIsListItemModalOpen(false)}
        tagId={listingId}
      />

      {/* Confirmation Modals */}
      <RemoveTagConfirmationModal
        isOpen={isRemoveTagFromAbandonedModalOpen}
        onClose={() => {
          setIsRemoveTagFromAbandonedModalOpen(false);
          setRemoveTagError(null); // Clear error when closing
        }}
        onConfirm={handleRemoveTagFromAbandonedConfirm}
        title="Remove Tag"
        description="The seller has failed to collect the item. Remove the tag to free it up for future use."
        confirmButtonText="Remove Tag"
        isLoading={actions.isRemoveTagLoading}
        variant="abandoned"
        error={removeTagError}
      />

      <RemoveTagConfirmationModal
        isOpen={isRemoveTagFromSoldModalOpen}
        onClose={() => {
          setIsRemoveTagFromSoldModalOpen(false);
          setRemoveTagError(null); // Clear error when closing
        }}
        onConfirm={handleRemoveTagFromSoldConfirm}
        title="Confirm Purchase"
        description="Please ensure the buyer can prove their purchase before confirming."
        confirmButtonText="Confirm Purchase"
        isLoading={actions.isRemoveTagLoading}
        variant="sold"
        error={removeTagError}
      />

      {/* Success Modals */}
      <SuccessModal
        isOpen={isCollectionSuccessModalOpen}
        onClose={() => setIsCollectionSuccessModalOpen(false)}
        title="Item Collected Successfully"
        description="The item has been successfully collected - please remove the tag."
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

// Outer component that provides the context
export default function ListingContainer() {
  const { id } = useParams();
  const listingId = typeof id === "string" ? parseInt(id) : 0;

  // Create actions without context values for the provider
  const actions = useListingActions(listingId);

  return (
    <ListingProvider actions={actions}>
      <ListingContent />
    </ListingProvider>
  );
}
