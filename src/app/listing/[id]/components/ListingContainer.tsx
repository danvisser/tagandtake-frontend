"use client";

import { useParams } from "next/navigation";
import { useListingData } from "@src/app/listing/[id]/hooks/useListingData";
import { useListingActions } from "@src/app/listing/[id]/hooks/useListingActions";
import WithListingState from "@src/app/listing/[id]/components/withListingState";
import ListingNavigation from "@src/app/listing/[id]/components/shared/ListingNavigation";
import LoadingSpinner from "@src/components/LoadingSpinner";
import { ListingProvider, useListingContext } from "@src/app/listing/[id]/context/ListingContext";
import CollectionModal from "@src/app/listing/[id]/components/modals/CollectionModal";
import ListItemModal from "@src/app/listing/[id]/components/modals/ListItemModal";
import CheckoutModal from "@src/app/listing/[id]/components/modals/CheckoutModal";
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
    actions,
  } = useListingContext();

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
        onCollect={actions.handleCollect}
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
