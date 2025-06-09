import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";
import { AbandonedItemListing } from "@src/api/listingsApi";

// Purchase tags
export const purchaseTags = async (
  pin: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await fetchClient({
      method: "POST",
      url: API_ROUTES.STORES.PURCHASE_TAGS,
      data: { pin },
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

// Simulate abandonment of a recalled listing (dev utility)
export const simulateAbandonListing = async (
  id: number
): Promise<{
  success: boolean;
  data?: AbandonedItemListing;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "PATCH",
      url: `/dev/recalled-listings/${id}/simulate-abandon/`,
    });
    return {
      success: true,
      data: data.data,
    };
  } catch (error: unknown) {
    console.error(`Simulate abandon for recalled listing ${id} error:`, error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          `Failed to simulate abandon for recalled listing ${id}`,
      };
    }
    throw error;
  }
};
