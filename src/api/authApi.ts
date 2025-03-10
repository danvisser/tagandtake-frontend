import { authRequest } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import { setAccessToken } from "@src/lib/fetchClient";
import axios from "axios";
import { UserRole } from "@src/types/roles";

export interface AuthResponse {
  role: UserRole | null;
  access?: string;
  user?: {
    role: UserRole;
  };
}

export const fetchUserSession = async (): Promise<AuthResponse> => {
  try {
    const { data } = await authRequest({
      method: "GET",
      url: API_ROUTES.AUTH.STATUS,
    });
    return {
      role: data.role as UserRole,
    };
  } catch {
    return { role: null };
  }
};

export const login = async (credentials: {
  username: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data } = await authRequest({
    method: "POST",
    url: API_ROUTES.AUTH.LOGIN,
    data: credentials,
  });

  if (data.access) {
    setAccessToken(data.access);
  }

  return {
    access: data.access,
    role: (data.user?.role as UserRole) || null,
  };
};

export const refreshAccessToken = async (): Promise<AuthResponse> => {
  const { data } = await authRequest({
    method: "POST",
    url: API_ROUTES.AUTH.REFRESH,
  });

  if (data.access) {
    setAccessToken(data.access);
  }

  return data;
};

export const logout = async (): Promise<void> => {
  await authRequest({
    method: "POST",
    url: API_ROUTES.AUTH.LOGOUT,
  });

  setAccessToken(null);
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
): Promise<AuthResponse> => {
  try {
    const { data } = await authRequest({
      method: "GET",
      url: API_ROUTES.ACTIVATION.ACTIVATE(uuid, token),
    });
    return {
      role: (data.role as UserRole) || null,
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
