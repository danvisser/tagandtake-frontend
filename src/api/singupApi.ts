import { authRequest } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface SignupResponse {
  username: string;
  email: string;
}

export interface SignupError {
  username?: string[];
  email?: string[];
  password?: string[];
  password2?: string[];
  non_field_errors?: string[];
}

export const signupMember = async (
  credentials: SignupCredentials
): Promise<{
  success: boolean;
  data?: SignupResponse;
  error?: SignupError;
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
        error: error.response.data as SignupError,
      };
    }
    throw error;
  }
};
