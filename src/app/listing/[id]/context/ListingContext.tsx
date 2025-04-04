import React, { createContext, useContext, useState } from "react";

interface ListingContextType {
  isCollectionModalOpen: boolean;
  setIsCollectionModalOpen: (isOpen: boolean) => void;
  isListItemModalOpen: boolean;
  setIsListItemModalOpen: (isOpen: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (isOpen: boolean) => void;
  actions: {
    handleCheckout: () => void;
    handleRemoveTagFromAbandoned: () => void;
    handleRemoveTagFromSold: () => void;
    handleCollect: (pin: string) => void;
    isCheckoutLoading: boolean;
    isRemoveTagLoading: boolean;
    isCollectLoading: boolean;
  };
}

const ListingContext = createContext<ListingContextType | null>(null);

export function ListingProvider({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions: ListingContextType["actions"];
}) {
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isListItemModalOpen, setIsListItemModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  return (
    <ListingContext.Provider
      value={{
        isCollectionModalOpen,
        setIsCollectionModalOpen,
        isListItemModalOpen,
        setIsListItemModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        actions,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
}

export function useListingContext() {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error("useListingContext must be used within a ListingProvider");
  }
  return context;
}
