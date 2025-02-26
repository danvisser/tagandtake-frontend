import { authRequest } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";

export const fetchUserSession = async () => {
  const { data } = await authRequest({ method: "GET", url: API_ROUTES.AUTH.STATUS });
  return data;
};

export const login = async (credentials: { email: string; password: string }) => {
  const { data } = await authRequest({ method: "POST", url: API_ROUTES.AUTH.LOGIN, data: credentials });
  return data;
};

export const logout = async () => {
  await authRequest({ method: "POST", url: API_ROUTES.AUTH.LOGOUT });
};
