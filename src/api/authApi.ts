import { authRequest } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import { setAccessToken } from "@src/lib/fetchClient";

export interface AuthResponse {
  role: string | null;
  access?: string;
  user?: {
    role: string;
  };
}

export const fetchUserSession = async (): Promise<AuthResponse> => {
  try {
    const { data } = await authRequest({
      method: "GET",
      url: API_ROUTES.AUTH.STATUS,
    });
    return {
      role: data.role,
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

  // Store the access token in memory
  if (data.access) {
    setAccessToken(data.access);
  }

  return {
    access: data.access,
    role: data.user?.role || null,
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

  // Clear the access token from memory
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
): Promise<void> => {
  try {
    await authRequest({
      method: "GET",
      url: API_ROUTES.ACTIVATION.ACTIVATE(uuid, token),
    });
  } catch (error) {
    console.error("Account activation error:", error);
    throw error;
  }
};
