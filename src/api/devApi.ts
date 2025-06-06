import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";

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
