import type { Meta, StoryObj } from "@storybook/react";
import { SuccessState } from "@src/app/listing/[id]/success/components/SuccessState";
import { ErrorState } from "@src/app/listing/[id]/success/components/ErrorState";
import { ExpiredState } from "@src/app/listing/[id]/success/components/ExpiredState";
import { NotFoundState } from "@src/app/listing/[id]/success/components/NotFoundState";
import { PendingState } from "@src/app/listing/[id]/success/components/PendingState";
import { ItemPurchasedResponse } from "@src/api/paymentsApi";
import { ItemStatus } from "@src/api/itemsApi";

const meta: Meta = {
  title: "Success Page States",
  parameters: {
    layout: "centered",
  },
};

export default meta;

// Mock data for the success state
const mockPurchaseData: ItemPurchasedResponse = {
  status: "COMPLETED",
  message: "Purchase successful",
  listing: {
    id: 123,
    tag: 456,
    store: 789,
    store_commission: 10,
    min_listing_days: 7,
    min_price: 0,
    user_listing_relation: "OWNER",
    tagandtake_commission: 5,
    tagandtake_flat_fee: 1,
    item: 101,
    item_price: 25.99,
    transaction_fee: 2.5,
    listing_price: 29.99,
    store_commission_amount: 2.99,
    member_earnings: 25.5,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    tag_removed: false,
    sold_at: "2023-01-02T00:00:00Z",
    item_details: {
      id: 101,
      name: "Blue T-Shirt",
      description: "A comfortable blue t-shirt made from 100% cotton.",
      size: "M",
      price: 25.99,
      condition: 1,
      category: 1,
      status: ItemStatus.SOLD,
      tag_id: 456,
      main_image: "https://picsum.photos/400/300",
      images: [
        {
          image_url: "https://picsum.photos/400/300",
          order: 1,
        },
      ],
    },
  },
};

// Success State Story
export const Success: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <SuccessState
        purchaseData={mockPurchaseData}
        onGoHome={() => console.log("Go home clicked")}
      />
    </div>
  ),
};

// Error State Story
export const Error: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <ErrorState
        onRetry={() => console.log("Retry clicked")}
        onGoHome={() => console.log("Go home clicked")}
      />
    </div>
  ),
};

// Expired State Story
export const Expired: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <ExpiredState
        onRetry={() => console.log("Retry clicked")}
        onGoHome={() => console.log("Go home clicked")}
      />
    </div>
  ),
};

// Not Found State Story
export const NotFound: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <NotFoundState
        onGoHome={() => console.log("Go home clicked")}
        onRetry={() => console.log("Retry clicked")}
      />
    </div>
  ),
};

// Pending State Story
export const Pending: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <PendingState
        onGoHome={() => console.log("Go home clicked")}
        onRetry={() => console.log("Retry clicked")}
      />
    </div>
  ),
};
