import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";
import { SoldItemListing } from "@src/api/listingsApi";

// Create a dedicated client for this specific endpoint
const paymentsClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL + "/" + process.env.NEXT_PUBLIC_API_VERSION,
  headers: { "Content-Type": "application/json" },
  validateStatus: () => true, // Accept all status codes
});

// Add auth token to requests
if (typeof window !== "undefined") {
  paymentsClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("auth_access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

// Types for payment account status
export interface AccountStatus {
  onboarded: boolean;
}

// Types for session response
export interface SessionResponse {
  client_secret: string;
}

// Types for checkout session
export interface CheckoutSession {
  id: string;
  client_secret: string;
}

// Types for supply order
export interface SupplyOrderItem {
  supply: {
    id: number;
    name: string;
    description: string;
    price: number;
    stripe_price_id: string;
  };
  quantity: number;
}

export interface SuppliesCheckoutRequest {
  supplies: SupplyOrderItem[];
}

export interface ItemPurchasedRequest {
  session_id: string;
  _t?: number; // Optional timestamp for cache busting
}

export interface ItemPurchasedResponse {
  status: string;
  message: string;
  listing?: SoldItemListing;
}

export interface SupplyPurchasedRequest {
  session_id: string;
}

export interface SupplyPurchasedResponse {
  status: string;
  message: string;
  store?: number;
}

// Get payment account status
export const getPaymentAccountStatus = async (): Promise<{
  success: boolean;
  data?: AccountStatus;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.PAYMENTS.ACCOUNT_STATUS,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get payment account status error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          "Failed to get payment account status",
      };
    }
    throw error;
  }
};

// Create onboarding session
export const createOnboardingSession = async (): Promise<{
  success: boolean;
  data?: SessionResponse;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.PAYMENTS.ONBOARDING,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Create onboarding session error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to create onboarding session",
      };
    }
    throw error;
  }
};

// Create account management session
export const createAccountManagementSession = async (): Promise<{
  success: boolean;
  data?: SessionResponse;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.PAYMENTS.MANAGEMENT,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Create account management session error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          "Failed to create account management session",
      };
    }
    throw error;
  }
};

// Create payouts session
export const createPayoutsSession = async (): Promise<{
  success: boolean;
  data?: SessionResponse;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.PAYMENTS.PAYOUTS,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Create payouts session error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to create payouts session",
      };
    }
    throw error;
  }
};

// Create checkout session for an item
export const createCheckoutSession = async (
  tag_id: number
): Promise<{
  success: boolean;
  data?: CheckoutSession;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.PAYMENTS.CHECKOUT_ITEM,
      data: { tag_id },
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Create checkout session error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to create checkout session",
      };
    }
    throw error;
  }
};

// Create checkout session for supplies
export const createSuppliesCheckoutSession = async (
  suppliesData: SuppliesCheckoutRequest
): Promise<{
  success: boolean;
  data?: CheckoutSession;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.PAYMENTS.CHECKOUT_SUPPLIES,
      data: suppliesData,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Create supplies checkout session error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          "Failed to create supplies checkout session",
      };
    }
    throw error;
  }
};

export const itemPurchased = async (
  itemPurchasedRequest: ItemPurchasedRequest
): Promise<{
  success: boolean;
  data?: ItemPurchasedResponse;
  error?: string;
}> => {
  try {
    const params: Record<string, string> = {
      session_id: itemPurchasedRequest.session_id,
    };

    // Add timestamp if provided for cache busting
    if (itemPurchasedRequest._t) {
      params._t = itemPurchasedRequest._t.toString();
    }

    const response = await paymentsClient({
      method: "GET",
      url: API_ROUTES.PAYMENTS.ITEM_PURCHASED,
      params,
    });

    // Handle different status codes
    if (
      response.status === 200 ||
      response.status === 202 ||
      response.status === 404 ||
      response.status === 410
    ) {
      return {
        success: true,
        data: response.data,
      };
    } else if (response.status === 400) {
      return {
        success: false,
        error: "Session ID is required",
      };
    } else {
      return {
        success: false,
        error:
          response.data?.detail ||
          response.data?.message ||
          "Failed to retrieve purchased details",
      };
    }
  } catch (error: unknown) {
    console.error("Item purchased error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};

export const supplyPurchased = async (
  supplyPurchasedRequest: SupplyPurchasedRequest
): Promise<{
  success: boolean;
  data?: SupplyPurchasedResponse;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.PAYMENTS.SUPPLY_PURCHASED,
      data: supplyPurchasedRequest,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Supply purchased error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          "Failed to retrieve purchased details",
      };
    }
    throw error;
  }
};
