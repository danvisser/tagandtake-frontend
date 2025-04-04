import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";
import { Item } from "./itemsApi";
import { ListingRole } from "@src/types/roles";

// Enum for recall reason types
export enum RecallReasonType {
  ISSUE = "issue",
  STORE_DISCRETION = "store discretion",
  OWNER_REQUEST = "owner request",
}

// Types for Recall Reason
export interface RecallReason {
  id: number;
  reason: string;
  type: RecallReasonType;
  description: string;
}

// Add these interfaces for store conditions and categories
export interface StoreCondition {
  id: number;
  condition: {
    id: number;
    condition: string;
    description?: string;
  };
}

export interface StoreCategory {
  id: number;
  category: {
    id: number;
    name: string;
    description?: string;
  };
}

// Base interface for listings
export interface BaseListing {
  id: number;
  tag: number;
  store: number;
  store_commission: number;
  min_listing_days: number;
  user_listing_relation: ListingRole;
  tagandtake_commission: number;
  tagandtake_flat_fee: number;
}

// Interface for vacant tags
export interface VacantTag extends BaseListing {
  is_member: boolean;
  store_conditions: StoreCondition[];
  store_categories: StoreCategory[];
}

// Interface for active listings
export interface ItemListing extends BaseListing {
  item: number;
  item_price: number;
  transaction_fee: number;
  listing_price: number;
  store_commission_amount: number;
  member_earnings: number;
  item_details: Item;
  created_at: string;
  updated_at: string;
}

// Interface for recalled listings
export interface RecalledItemListing extends ItemListing {
  reason: RecallReason;
  recalled_at: string;
  collection_pin?: string;
  collection_deadline: string;
}

// Interface for abandoned listings
export interface AbandonedItemListing extends ItemListing {
  reason: RecallReason;
  abandoned_at: string;
  tag_removed: boolean;
}

// Interface for sold listings
export interface SoldItemListing extends ItemListing {
  tag_removed: boolean;
  sold_at: string;
}

// Interface for listing creation
export interface CreateListingData {
  item_id: number;
  tag_id: number;
}

// Interface for creating an item and listing together
export interface CreateItemAndListingData {
  name: string;
  description?: string;
  size?: string;
  price: number;
  condition: number;
  category: number;
  image: File;
  tag_id: number;
}

// Error types
export interface ListingError {
  item_id?: string[];
  tag_id?: string[];
  non_field_errors?: string[];
}

// Response for checking listing role
export interface ListingRoleResponse {
  user_listing_relation: ListingRole;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Interface for tag availability response
export interface TagAvailabilityResponse {
  is_available: boolean;
  reason?: string;
}

// Create a new listing
export const createListing = async (
  listingData: CreateListingData
): Promise<{
  success: boolean;
  data?: ItemListing;
  error?: ListingError;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.MEMBERS.LISTINGS.CREATE,
      data: listingData,
    });

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error("Create listing error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as ListingError,
      };
    }
    throw error;
  }
};

// Create an item and listing in one request
export const createItemAndListing = async (
  formData: CreateItemAndListingData
): Promise<{
  success: boolean;
  data?: ItemListing;
  error?: ListingError;
}> => {
  try {
    const form = new FormData();
    form.append("name", formData.name);
    if (formData.description) form.append("description", formData.description);
    if (formData.size) form.append("size", formData.size);
    form.append("price", formData.price.toString());
    form.append("condition", formData.condition.toString());
    form.append("category", formData.category.toString());
    form.append("image", formData.image);
    form.append("tag_id", formData.tag_id.toString());

    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.MEMBERS.ITEM_LISTINGS,
      data: form,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error("Create item and listing error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as ListingError,
      };
    }
    throw error;
  }
};

// Get a listing by ID
export const getListing = async (
  id: number
): Promise<{
  success: boolean;
  data?: ItemListing;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.MEMBERS.LISTINGS.DETAILS(id),
    });
    console.log(data);
    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error(`Get listing ${id} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || `Failed to fetch listing ${id}`,
      };
    }
    throw error;
  }
};

// Check user's role for a listing
export const checkListingRole = async (
  id: number
): Promise<{
  success: boolean;
  data?: ListingRoleResponse;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.MEMBERS.LISTINGS.CHECK_ROLE(id),
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error(`Check listing role ${id} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to check listing role for ${id}`,
      };
    }
    throw error;
  }
};

// Update getStoreListings to handle pagination
export const getStoreListings = async (): Promise<{
  success: boolean;
  data?: PaginatedResponse<ItemListing>;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.LISTINGS.LIST,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get store listings error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to fetch store listings",
      };
    }
    throw error;
  }
};

// Update getStoreRecalledListings to handle pagination
export const getStoreRecalledListings = async (): Promise<{
  success: boolean;
  data?: PaginatedResponse<RecalledItemListing>;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.RECALLED_LISTINGS.LIST,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get store recalled listings error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to fetch recalled listings",
      };
    }
    throw error;
  }
};

// Replace a tag for a listing
export const replaceListingTag = async (
  id: number,
  newTagId: number
): Promise<{
  success: boolean;
  data?: ItemListing;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.STORES.LISTINGS.REPLACE_TAG(id),
      data: { new_tag_id: newTagId },
    });

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error(`Replace tag for listing ${id} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to replace tag for listing ${id}`,
      };
    }
    throw error;
  }
};

// Recall a listing
export const recallListing = async (
  id: number,
  reasonId: number
): Promise<{
  success: boolean;
  data?: RecalledItemListing;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.STORES.LISTINGS.RECALL(id),
      data: { reason: reasonId },
    });

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error(`Recall listing ${id} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || `Failed to recall listing ${id}`,
      };
    }
    throw error;
  }
};

// Delist a listing
export const delistListing = async (
  id: number,
  reasonId: number
): Promise<{
  success: boolean;
  data?: RecalledItemListing;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.STORES.LISTINGS.DELIST(id),
      data: { reason: reasonId },
    });
    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error(`Delist listing ${id} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || `Failed to delist listing ${id}`,
      };
    }
    throw error;
  }
};

// Generate a new collection PIN for a recalled listing
export const generateCollectionPin = async (
  id: number
): Promise<{
  success: boolean;
  data?: RecalledItemListing;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.MEMBERS.RECALLED_LISTINGS.GENERATE_COLLECTION_PIN(id),
    });

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error(`Generate collection PIN for listing ${id} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to generate collection PIN for listing ${id}`,
      };
    }
    throw error;
  }
};

// Collect a recalled listing
export const collectRecalledListing = async (
  id: number,
  pin: string
): Promise<{
  success: boolean;
  data?: RecalledItemListing;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.STORES.RECALLED_LISTINGS.COLLECT(id),
      data: { pin },
    });

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error(`Collect recalled listing ${id} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to collect recalled listing ${id}`,
      };
    }
    throw error;
  }
};

// Update getPublicStoreListings to handle pagination
export const getPublicStoreListings = async (
  storeId: number
): Promise<{
  success: boolean;
  data?: PaginatedResponse<ItemListing>;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: `/stores/${storeId}/listings/`,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error(
      `Get public store listings for store ${storeId} error:`,
      error
    );
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to fetch listings for store ${storeId}`,
      };
    }
    throw error;
  }
};

// Get store abandoned listings
export const getStoreAbandonedListings = async (
  params?: Record<string, string>
): Promise<{
  success: boolean;
  data?: AbandonedItemListing[];
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.ABANDONED_LISTINGS.LIST,
      params,
    });

    return {
      success: true,
      data: data,
    };
  } catch (error: unknown) {
    console.error("Get store abandoned listings error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to fetch abandoned listings",
      };
    }
    throw error;
  }
};

// Get store sold listings
export const getStoreSoldListings = async (
  params?: Record<string, string>
): Promise<{
  success: boolean;
  data?: SoldItemListing[];
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.SOLD_LISTINGS.LIST,
      params,
    });

    return {
      success: true,
      data: data,
    };
  } catch (error: unknown) {
    console.error("Get store sold listings error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to fetch sold listings",
      };
    }
    throw error;
  }
};

// Remove tag from abandoned listing
export const removeTagFromAbandonedListing = async (
  id: number
): Promise<{
  success: boolean;
  data?: AbandonedItemListing;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.STORES.ABANDONED_LISTINGS.REMOVE_TAG(id),
    });

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error(`Remove tag from abandoned listing ${id} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to remove tag from abandoned listing ${id}`,
      };
    }
    throw error;
  }
};

// Remove tag from sold listing
export const removeTagFromSoldListing = async (
  id: number
): Promise<{
  success: boolean;
  data?: SoldItemListing;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.STORES.SOLD_LISTINGS.REMOVE_TAG(id),
    });

    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error(`Remove tag from sold listing ${id} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to remove tag from sold listing ${id}`,
      };
    }
    throw error;
  }
};

export const checkTagAvailability = async (
  tagId: number
): Promise<{
  success: boolean;
  data?: TagAvailabilityResponse;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.MEMBERS.LISTINGS.CHECK_TAG_AVAILABILITY(tagId),
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error(`Check tag availability ${tagId} error:`, error);
    if (axios.isAxiosError(error)) {
      // Handle 404 case specifically
      if (error.response?.status === 404) {
        return {
          success: false,
          error: error.response.data.DETAIL || "Tag not found",
        };
      }
      return {
        success: false,
        error:
          error.response?.data?.DETAIL ||
          `Failed to check tag availability for ${tagId}`,
      };
    }
    throw error;
  }
};
