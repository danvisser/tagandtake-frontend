import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const fetchClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const authRequest = (config: AxiosRequestConfig) => {
  return fetchClient({
    ...config,
    withCredentials: true,
  });
};
