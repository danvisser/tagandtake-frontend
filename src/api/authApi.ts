import { authRequest } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";
import { UserRole } from "@src/types/roles";

export interface AuthSuccessResponse {
  access: string;
  user: {
    role: UserRole | null;
  };
}

export interface FieldError {
  [field: string]: string[];
}

export interface AuthErrorResponse {
  non_field_errors?: string[];
  detail?: string;
  error?: string;
  [key: string]: string[] | string | undefined;
}

export const fetchUserSession = async (): Promise<AuthSuccessResponse> => {
  try {
    const { data } = await authRequest({
      method: "GET",
      url: API_ROUTES.AUTH.STATUS,
    });
    return {
      access: data.access,
      user: { role: data.user.role as UserRole },
    };
  } catch {
    return {
      access: "",
      user: { role: null },
    };
  }
};

export const login = async (credentials: {
  username: string;
  password: string;
}): Promise<AuthSuccessResponse> => {
  const { data } = await authRequest({
    method: "POST",
    url: API_ROUTES.AUTH.LOGIN,
    data: credentials,
  });
  return data;
};

export const refreshAccessToken = async (): Promise<AuthSuccessResponse> => {
  const { data } = await authRequest({
    method: "POST",
    url: API_ROUTES.AUTH.REFRESH,
  });
  return data;
};

export const logout = async (): Promise<void> => {
  await authRequest({
    method: "POST",
    url: API_ROUTES.AUTH.LOGOUT,
  });
};

export const resendActivation = async (email: string): Promise<void> => {
  await authRequest({
    method: "POST",
    url: API_ROUTES.ACTIVATION.RESEND,
    data: { email },
  });
};

export const activateAccount = async (
  uuid: string,
  token: string
): Promise<AuthSuccessResponse> => {
  try {
    const { data } = await authRequest({
      method: "GET",
      url: API_ROUTES.ACTIVATION.ACTIVATE(uuid, token),
    });
    // Backend returns: { message: "...", role: "member" | "store" }
    return {
      access: data.access || "",
      user: { role: (data.role || data.user?.role) as UserRole },
    };
  } catch (error: unknown) {
    console.error("Account activation error:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await authRequest({
    method: "POST",
    url: API_ROUTES.PASSWORD.RESET,
    data: { email },
  });
};

export const confirmPasswordReset = async (data: {
  uid: string;
  token: string;
  new_password: string;
  confirm_new_password: string;
}): Promise<void> => {
  try {
    await authRequest({
      method: "POST",
      url: API_ROUTES.PASSWORD.RESET_CONFIRM,
      data,
    });
  } catch (error: unknown) {
    console.error("Password reset confirmation error:", error);
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};
