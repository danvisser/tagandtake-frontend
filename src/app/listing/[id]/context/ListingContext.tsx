import React, { createContext, useContext, useState } from "react";

// Define the return type for actions
export interface ActionResult {
  success: boolean;
  error: string | null;
}

// Define the type for the actions
export interface ListingActions {
  handleRemoveTagFromAbandoned: () => Promise<ActionResult>;
  handleRemoveTagFromSold: () => Promise<ActionResult>;
  handleCollect: (pin: string) => Promise<ActionResult>;
  isRemoveTagLoading: boolean;
  isCollectLoading: boolean;
}

// Define the type for the context
export interface ListingContextType {
  // Modal states
  isCollectionModalOpen: boolean;
  setIsCollectionModalOpen: (isOpen: boolean) => void;
  isListItemModalOpen: boolean;
  setIsListItemModalOpen: (isOpen: boolean) => void;
  isRemoveTagFromAbandonedModalOpen: boolean;
  setIsRemoveTagFromAbandonedModalOpen: (isOpen: boolean) => void;
  isRemoveTagFromSoldModalOpen: boolean;
  setIsRemoveTagFromSoldModalOpen: (isOpen: boolean) => void;
  isCollectionSuccessModalOpen: boolean;
  setIsCollectionSuccessModalOpen: (isOpen: boolean) => void;
  isRemoveTagSuccessModalOpen: boolean;
  setIsRemoveTagSuccessModalOpen: (isOpen: boolean) => void;
  isListingSuccessModalOpen: boolean;
  setIsListingSuccessModalOpen: (isOpen: boolean) => void;
  // Error states
  collectionError: string | null;
  setCollectionError: (error: string | null) => void;
  removeTagError: string | null;
  setRemoveTagError: (error: string | null) => void;
  // Actions
  actions: ListingActions;
}

// Create the context with a default value
const ListingContext = createContext<ListingContextType | undefined>(undefined);

// Provider component
export function ListingProvider({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions: ListingActions;
}) {
  // Modal states
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isListItemModalOpen, setIsListItemModalOpen] = useState(false);
  const [
    isRemoveTagFromAbandonedModalOpen,
    setIsRemoveTagFromAbandonedModalOpen,
  ] = useState(false);
  const [isRemoveTagFromSoldModalOpen, setIsRemoveTagFromSoldModalOpen] =
    useState(false);
  const [isCollectionSuccessModalOpen, setIsCollectionSuccessModalOpen] =
    useState(false);
  const [isRemoveTagSuccessModalOpen, setIsRemoveTagSuccessModalOpen] =
    useState(false);
  const [isListingSuccessModalOpen, setIsListingSuccessModalOpen] =
    useState(false);

  // Error states
  const [collectionError, setCollectionError] = useState<string | null>(null);
  const [removeTagError, setRemoveTagError] = useState<string | null>(null);

  const value = {
    // Modal states
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
    isListingSuccessModalOpen,
    setIsListingSuccessModalOpen,
    // Error states
    collectionError,
    setCollectionError,
    removeTagError,
    setRemoveTagError,
    // Actions
    actions,
  };

  return (
    <ListingContext.Provider value={value}>{children}</ListingContext.Provider>
  );
}

// Custom hook to use the listing context
export function useListingContext() {
  const context = useContext(ListingContext);
  if (context === undefined) {
    throw new Error("useListingContext must be used within a ListingProvider");
  }
  return context;
}
