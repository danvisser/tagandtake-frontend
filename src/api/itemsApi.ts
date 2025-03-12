import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";

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
}

// Types for Item Creation
export interface ItemCreateData {
  name: string;
  description?: string;
  size?: string;
  price: number;
  condition: number;
  category: number;
  image: File;
}

// Types for Item Update
export interface ItemUpdateData {
  name?: string;
  description?: string;
  size?: string;
  price?: number;
  condition?: number;
  category?: number;
  image?: File;
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

// Get all items for the current member
export const getMemberItems = async (): Promise<{
  success: boolean;
  data?: Item[];
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.MEMBERS.ITEMS.LIST,
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
        error: error.response?.data?.detail || "Failed to fetch items",
      };
    }
    throw error;
  }
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
    formData.append("name", itemData.name);
    if (itemData.description)
      formData.append("description", itemData.description);
    if (itemData.size) formData.append("size", itemData.size);
    formData.append("price", itemData.price.toString());
    formData.append("condition", itemData.condition.toString());
    formData.append("category", itemData.category.toString());
    formData.append("image", itemData.image);

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
    if (itemData.name) formData.append("name", itemData.name);
    if (itemData.description)
      formData.append("description", itemData.description);
    if (itemData.size) formData.append("size", itemData.size);
    if (itemData.price) formData.append("price", itemData.price.toString());
    if (itemData.condition)
      formData.append("condition", itemData.condition.toString());
    if (itemData.category)
      formData.append("category", itemData.category.toString());
    if (itemData.image) formData.append("image", itemData.image);

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
