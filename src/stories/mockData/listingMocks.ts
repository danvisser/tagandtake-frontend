import { ItemStatus } from "@src/api/itemsApi";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
  RecallReasonType,
} from "@src/api/listingsApi";
import { LISTING_ROLES } from "@src/types/roles";

// Mock data for images
export const mockImages = [
  {
    image_url: "https://placehold.co/600x600/e2e8f0/1e293b?text=Item+Image+1",
    order: 1,
  },
  {
    image_url: "https://placehold.co/600x600/e2e8f0/1e293b?text=Item+Image+2",
    order: 2,
  },
];

// Base mock listing data
export const baseListing = {
  id: 1,
  item: 1,
  tag: 123,
  store_commission: 20,
  min_listing_days: 30,
  item_price: 80,
  transaction_fee: 5,
  listing_price: 100,
  store_commission_amount: 20,
  member_earnings: 75,
  created_at: "2023-10-15T12:00:00Z",
  updated_at: "2023-10-15T12:00:00Z",
  user_listing_relation: LISTING_ROLES.VIEWER,
  item_details: {
    id: 1,
    name: "Vintage Denim Jacket",
    description: "Classic vintage denim jacket in excellent condition",
    size: "M",
    price: 80,
    condition: 2,
    category: 3,
    status: ItemStatus.LISTED,
    tag_id: 123,
    images: mockImages,
    main_image: mockImages[0].image_url,
    category_details: {
      id: 3,
      name: "Outerwear",
      description: "Jackets, coats, and other outer layers",
    },
    condition_details: {
      id: 2,
      condition: "Excellent",
      description: "Like new with minimal signs of wear",
    },
  },
};

// Mock active listing
export const activeListing: ItemListing = {
  ...baseListing,
  listing_exists: true,
  tagandtake_commission: 5,
  tagandtake_flat_fee: 2,
};

// Mock recalled listing
export const recalledListing: RecalledItemListing = {
  ...baseListing,
  reason: {
    id: 1,
    reason: "Quality issues",
    type: RecallReasonType.ISSUE,
    description: "Item has quality issues that need to be addressed",
  },
  recalled_at: "2023-10-20T14:30:00Z",
  collection_pin: "1234",
  collection_deadline: "2023-11-20T14:30:00Z",
};

// Mock abandoned listing
export const abandonedListing: AbandonedItemListing = {
  ...baseListing,
  reason: {
    id: 2,
    reason: "Not collected",
    type: RecallReasonType.STORE_DISCRETION,
    description: "Item was not collected by the deadline",
  },
  abandoned_at: "2023-11-21T14:30:00Z",
  tag_removed: false,
};

// Mock sold listing
export const soldListing: SoldItemListing = {
  ...baseListing,
  sold_at: "2023-10-25T16:45:00Z",
};

// Mock listing with no images
export const noImagesListing: ItemListing = {
  ...activeListing,
  item_details: {
    id: 1,
    name: "Vintage Denim Jacket",
    description: "Classic vintage denim jacket in excellent condition",
    size: "M",
    price: 80,
    condition: 2,
    category: 3,
    status: ItemStatus.LISTED,
    tag_id: 123,
    images: [],
    main_image: "",
    category_details: {
      id: 3,
      name: "Outerwear",
      description: "Jackets, coats, and other outer layers",
    },
    condition_details: {
      id: 2,
      condition: "Excellent",
      description: "Like new with minimal signs of wear",
    },
  },
};

// Vacant tag (no listing)
export const noListing: undefined = undefined;
