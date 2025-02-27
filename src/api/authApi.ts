import { authRequest } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const BASE_URL = `${API_URL}${API_VERSION}`;

export const fetchUserSession = async () => {
  const { data } = await authRequest({ method: "GET", url: `${BASE_URL}/${API_ROUTES.AUTH.STATUS}` });
  return data;
};

export const login = async (credentials: { email: string; password: string }) => {
    const { data } = await authRequest({ method: "POST", url: `${BASE_URL}/${API_ROUTES.AUTH.LOGIN}`, data: credentials });
  return data;
};

export const logout = async () => {
  await authRequest({ method: "POST", url: `${BASE_URL}/${API_ROUTES.AUTH.LOGOUT}` });
};
