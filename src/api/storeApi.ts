import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";
import { ItemCategory, ItemCondition } from "./itemsApi";

// Types for Store Address
export interface StoreAddress {
  street_address: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

// Types for Store Opening Hours
export interface StoreOpeningHours {
  day_of_week: string;
  opening_time?: string;
  closing_time?: string;
  timezone?: string;
  is_closed?: boolean;
}

// Types for Store Notification Preferences
export interface StoreNotificationPreferences {
  secondary_email?: string;
  new_listing_notifications: boolean;
  sale_notifications: boolean;
}

// Types for Store Profile
export interface StoreProfile {
  id: number;
  store_name: string;
  phone?: string;
  store_bio?: string;
  profile_photo_url?: string;
  google_profile_url?: string;
  website_url?: string;
  instagram_url?: string;
  commission: number;
  stock_limit: number;
  active_listings_count: number;
  remaining_stock: number;
  min_listing_days: number;
  min_price: number;
  currency: string;
  opening_hours?: StoreOpeningHours[];
  store_address?: StoreAddress;
  created_at: string;
  updated_at: string;
}

// Types for Store Profile Update
export interface StoreProfileUpdate {
  store_name?: string;
  phone?: string;
  store_bio?: string;
  google_profile_url?: string;
  website_url?: string;
  instagram_url?: string;
  commission?: number;
  stock_limit?: number;
  min_listing_days?: number;
  min_price?: number;
  store_address?: StoreAddress;
  opening_hours?: StoreOpeningHours[];
}

// Types for Store Profile Image
export interface StoreProfileImage {
  profile_photo?: File;
  profile_photo_url?: string;
}

// Types for Store Item Category
export interface StoreItemCategory {
  id: number;
  category: ItemCategory;
}

// Types for Store Item Condition
export interface StoreItemCondition {
  id: number;
  condition: ItemCondition;
}

// Types for Store Item Category Bulk Update
export interface StoreItemCategoryBulkUpdate {
  categories: number[];
}

// Types for Store Item Condition Bulk Update
export interface StoreItemConditionBulkUpdate {
  conditions: number[];
}

// Types for Public Store List
export interface PublicStore {
  id: number;
  store_name: string;
  profile_photo_url?: string;
  store_address?: StoreAddress;
  google_profile_url?: string;
  distance?: number;
  has_capacity: boolean;
  remaining_stock: number;
  active_stock: number;
  category_ids: number[];
  condition_ids: number[];
  commission: number;
  stock_limit: number;
  min_listing_days: number;
  min_price: number;
}

// Types for Basic Store Info
export interface BasicStoreInfo {
  id: number;
  store_name: string;
  commission: number;
  min_listing_days: number;
  min_price: number;
  categories: ItemCategory[];
  conditions: ItemCondition[];
}

// Types for Store List Response
export interface StoreListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PublicStore[];
}

export interface StoreError {
  store_name?: string[];
  phone?: string[];
  store_bio?: string[];
  google_profile_url?: string[];
  website_url?: string[];
  instagram_url?: string[];
  commission?: string[];
  stock_limit?: string[];
  min_listing_days?: string[];
  min_price?: string[];
  store_address?: {
    street_address?: string[];
    city?: string[];
    state?: string[];
    postal_code?: string[];
    country?: string[];
  };
  opening_hours?: string[];
  categories?: string[];
  conditions?: string[];
  non_field_errors?: string[];
}

// Get store profile
export const getStoreProfile = async (): Promise<{
  success: boolean;
  data?: StoreProfile;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.PROFILE,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get store profile error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to fetch store profile",
      };
    }
    throw error;
  }
};

// Update store profile
export const updateStoreProfile = async (
  profileData: StoreProfileUpdate
): Promise<{
  success: boolean;
  data?: StoreProfile;
  error?: StoreError;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.STORES.PROFILE,
      data: profileData,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Update store profile error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as StoreError,
      };
    }
    throw error;
  }
};

// Generate new store PIN
export const generateNewStorePin = async (): Promise<{
  success: boolean;
  data?: { message: string };
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.STORES.PIN,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Generate new store PIN error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to generate new PIN",
      };
    }
    throw error;
  }
};

// Get store categories
export const getStoreCategories = async (): Promise<{
  success: boolean;
  data?: StoreItemCategory[];
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.CATEGORIES,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get store categories error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to fetch store categories",
      };
    }
    throw error;
  }
};

// Update store categories
export const updateStoreCategories = async (
  categoriesData: StoreItemCategoryBulkUpdate
): Promise<{
  success: boolean;
  data?: StoreItemCategory[];
  error?: StoreError;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.STORES.CATEGORIES,
      data: categoriesData,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Update store categories error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as StoreError,
      };
    }
    throw error;
  }
};

// Get store conditions
export const getStoreConditions = async (): Promise<{
  success: boolean;
  data?: StoreItemCondition[];
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.CONDITIONS,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get store conditions error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to fetch store conditions",
      };
    }
    throw error;
  }
};

// Update store conditions
export const updateStoreConditions = async (
  conditionsData: StoreItemConditionBulkUpdate
): Promise<{
  success: boolean;
  data?: StoreItemCondition[];
  error?: StoreError;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.STORES.CONDITIONS,
      data: conditionsData,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Update store conditions error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as StoreError,
      };
    }
    throw error;
  }
};

// Get public store categories
export const getPublicStoreCategories = async (
  storeId: number
): Promise<{
  success: boolean;
  data?: StoreItemCategory[];
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.PUBLIC_CATEGORIES(storeId),
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error(
      `Get public store categories for store ${storeId} error:`,
      error
    );
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to fetch categories for store ${storeId}`,
      };
    }
    throw error;
  }
};

// Get public store conditions
export const getPublicStoreConditions = async (
  storeId: number
): Promise<{
  success: boolean;
  data?: StoreItemCondition[];
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.PUBLIC_CONDITIONS(storeId),
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error(
      `Get public store conditions for store ${storeId} error:`,
      error
    );
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to fetch conditions for store ${storeId}`,
      };
    }
    throw error;
  }
};

// Get store notification preferences
export const getStoreNotificationPreferences = async (): Promise<{
  success: boolean;
  data?: StoreNotificationPreferences;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.NOTIFICATION_SETTINGS,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get store notification preferences error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          "Failed to fetch notification preferences",
      };
    }
    throw error;
  }
};

// Update store notification preferences
export const updateStoreNotificationPreferences = async (
  preferencesData: StoreNotificationPreferences
): Promise<{
  success: boolean;
  data?: StoreNotificationPreferences;
  error?: StoreError;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: API_ROUTES.STORES.NOTIFICATION_SETTINGS,
      data: preferencesData,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Update store notification preferences error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as StoreError,
      };
    }
    throw error;
  }
};

// Upload store profile photo
export const uploadStoreProfilePhoto = async (
  photoData: FormData
): Promise<{
  success: boolean;
  data?: StoreProfileImage;
  error?: StoreError;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.STORES.PROFILE_PHOTO,
      data: photoData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Upload store profile photo error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as StoreError,
      };
    }
    throw error;
  }
};

// Delete store profile photo
export const deleteStoreProfilePhoto = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await fetchClient({
      method: "DELETE",
      url: API_ROUTES.STORES.PROFILE_PHOTO,
    });

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Delete store profile photo error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete profile photo",
      };
    }
    throw error;
  }
};

// Purchase tags
export const purchaseTags = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await fetchClient({
      method: "POST",
      url: API_ROUTES.STORES.PURCHASE_TAGS,
    });

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Purchase tags error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to purchase tags",
      };
    }
    throw error;
  }
};

// Get public stores
export const getPublicStores = async (
  params?: Record<string, string>
): Promise<{
  success: boolean;
  data?: StoreListResponse;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.LIST,
      params,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get public stores error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to fetch public stores",
      };
    }
    throw error;
  }
};

// Get basic store info by tag ID
export const getBasicStoreInfo = async (
  tagId: number
): Promise<{
  success: boolean;
  data?: BasicStoreInfo;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.STORES.BASIC_INFO(tagId),
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error(`Get basic store info for tag ${tagId} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to fetch basic store info for tag ${tagId}`,
      };
    }
    throw error;
  }
};
