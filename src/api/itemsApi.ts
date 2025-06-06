import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";
import {
  appendItemFormData,
  appendItemUpdateFormData,
} from "@src/lib/formUtils";

// Types for Item Category
export interface ItemCategory {
  id: number;
  name: string;
  description?: string;
}

// Types for Item Condition
export interface ItemCondition {
  id: number;
  condition: string;
  description?: string;
}

// Types for Item Images
export interface ItemImage {
  image_url: string;
  order: number;
}

// Item Status Enum
export enum ItemStatus {
  AVAILABLE = "available",
  LISTED = "listed",
  RECALLED = "recalled",
  SOLD = "sold",
  ABANDONED = "abandoned",
}

// Store info for items
export interface ItemStoreInfo {
  store_id: number;
  store_name: string;
  listed_at?: string;
  sold_at?: string;
  recalled_at?: string;
  abandoned_at?: string;
  reason?: string;
  description?: string;
  collection_deadline?: string;
  tag_removed?: boolean;
}

// Types for Item
export interface Item {
  id: number;
  name: string;
  description?: string;
  size?: string;
  price: number;
  condition: number;
  category: number;
  status?: ItemStatus;
  tag_id?: number;
  images: ItemImage[];
  main_image?: string;
  category_details?: ItemCategory;
  condition_details?: ItemCondition;
  store_info?: ItemStoreInfo;
}

// Types for Item Creation
export interface ItemCreateData {
  name: string;
  description?: string;
  size?: string;
  price: number;
  condition: number;
  category: number;
  images: File[];
}

// Types for Item Update
export interface ItemUpdateData {
  name?: string;
  description?: string;
  size?: string;
  price?: number;
  condition?: number;
  category?: number;
  images?: File[];
}

// Error types
export interface ItemError {
  name?: string[];
  description?: string[];
  size?: string[];
  price?: string[];
  condition?: string[];
  category?: string[];
  image?: string[];
  non_field_errors?: string[];
}

// Add this interface for paginated responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Interface for member items filter options
export interface MemberItemsFilters {
  status?: string | string[]; // Can be single status or array of statuses
  category?: number;
  condition?: number;
  search?: string;
  sort_by?: string; // For sorting options
}

// Get member items with filters
export const getMemberItems = async (
  filters?: MemberItemsFilters
): Promise<{
  success: boolean;
  data?: PaginatedResponse<Item>;
  error?: string;
}> => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();

    if (filters?.status) {
      // Handle both single status and array of statuses
      if (Array.isArray(filters.status)) {
        filters.status.forEach((status) =>
          queryParams.append("status", status)
        );
      } else {
        queryParams.append("status", filters.status);
      }
    }

    if (filters?.category)
      queryParams.append("category", filters.category.toString());
    if (filters?.condition)
      queryParams.append("condition", filters.condition.toString());
    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.sort_by) queryParams.append("sort_by", filters.sort_by);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_ROUTES.MEMBERS.ITEMS.LIST}?${queryString}`
      : API_ROUTES.MEMBERS.ITEMS.LIST;

    const { data } = await fetchClient({
      method: "GET",
      url: url,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get member items error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to fetch member items",
      };
    }
    throw error;
  }
};

// Helper function to get available items
export const getAvailableItems = async (): Promise<{
  success: boolean;
  data?: Item[];
  error?: string;
}> => {
  const response = await getMemberItems({ status: ItemStatus.AVAILABLE });

  return {
    success: response.success,
    data: response.data?.results,
    error: response.error,
  };
};

// Create a new item
export const createItem = async (
  itemData: ItemCreateData
): Promise<{
  success: boolean;
  data?: Item;
  error?: ItemError;
}> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Use the utility function to append item data
    appendItemFormData(formData, itemData);

    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.MEMBERS.ITEMS.CREATE,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Create item error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as ItemError,
      };
    }
    throw error;
  }
};

// Get a specific item by ID
export const getItemById = async (
  itemId: number
): Promise<{
  success: boolean;
  data?: Item;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.MEMBERS.ITEMS.DETAILS(itemId),
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error(`Get item ${itemId} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || `Failed to fetch item ${itemId}`,
      };
    }
    throw error;
  }
};

// Update an existing item
export const updateItem = async (
  itemId: number,
  itemData: ItemUpdateData
): Promise<{
  success: boolean;
  data?: Item;
  error?: ItemError;
}> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Use the utility function to append item update data
    appendItemUpdateFormData(formData, itemData);

    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.MEMBERS.ITEMS.UPDATE(itemId),
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error(`Update item ${itemId} error:`, error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as ItemError,
      };
    }
    throw error;
  }
};

// Delete an item
export const deleteItem = async (
  itemId: number
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await fetchClient({
      method: "DELETE",
      url: API_ROUTES.MEMBERS.ITEMS.DELETE(itemId),
    });

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error(`Delete item ${itemId} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail || `Failed to delete item ${itemId}`,
      };
    }
    throw error;
  }
};

// Get all item categories
export const getItemCategories = async (): Promise<{
  success: boolean;
  data?: ItemCategory[];
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.ITEMS.CATEGORIES,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get item categories error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to fetch item categories",
      };
    }
    throw error;
  }
};

// Get all item conditions
export const getItemConditions = async (): Promise<{
  success: boolean;
  data?: ItemCondition[];
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.ITEMS.CONDITIONS,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get item conditions error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to fetch item conditions",
      };
    }
    throw error;
  }
};
