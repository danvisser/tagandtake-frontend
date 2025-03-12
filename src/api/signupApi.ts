import { authRequest } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";
import { UserRole } from "@src/types/roles";

export interface MemberSignupCredentials {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface MemberSignupResponse {
  username: string;
  email: string;
}

export interface MemberSignupError {
  username?: string[];
  email?: string[];
  password?: string[];
  password2?: string[];
  non_field_errors?: string[];
}

export const signupMember = async (
  credentials: MemberSignupCredentials
): Promise<{
  success: boolean;
  data?: MemberSignupResponse;
  error?: MemberSignupError;
}> => {
  try {
    const { data } = await authRequest({
      method: "POST",
      url: API_ROUTES.SIGNUP.MEMBER,
      data: credentials,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Signup error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as MemberSignupError,
      };
    }
    throw error;
  }
};

export interface StoreSignupCredentials {
  username: string;
  email: string;
  password: string;
  password2: string;
  store: {
    store_name: string;
    phone?: string;
    store_bio?: string;
    google_profile_url?: string;
    website_url?: string;
    instagram_url?: string;
  };
  store_address: {
    street_address: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  opening_hours: Array<{
    day_of_week: string;
    opening_time?: string;
    closing_time?: string;
    timezone?: string;
    is_closed?: boolean;
  }>;
}

export interface StoreSignupResponse {
  username: string;
  email: string;
  role: UserRole;
}

export interface StoreSignupError {
  username?: string[];
  email?: string[];
  password?: string[];
  password2?: string[];
  non_field_errors?: string[];
  store?: {
    store_name?: string[];
    phone?: string[];
    store_bio?: string[];
    website_url?: string[];
    instagram_url?: string[];
  };
  store_address?: {
    street_address?: string[];
    city?: string[];
    state?: string[];
    postal_code?: string[];
    country?: string[];
  };
}

export const signupStore = async (
  credentials: StoreSignupCredentials
): Promise<{
  success: boolean;
  data?: StoreSignupResponse;
  error?: StoreSignupError;
}> => {
  try {
    const { data } = await authRequest({
      method: "POST",
      url: API_ROUTES.SIGNUP.STORE,
      data: credentials,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Store signup error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      console.log(
        "Store signup error details:",
        JSON.stringify(error.response.data, null, 2)
      );
      return {
        success: false,
        error: error.response.data as StoreSignupError,
      };
    }
    throw error;
  }
};
