import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";

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
  listingId: number
): Promise<{
  success: boolean;
  data?: CheckoutSession;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.PAYMENTS.CHECKOUT_ITEM,
      data: { listing_id: listingId },
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
