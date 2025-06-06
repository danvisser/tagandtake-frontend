import { useAuthStore } from "@src/stores/authStore";
import { setAccessToken } from "@src/lib/fetchClient";
import { Routes } from "@src/constants/routes";

// Central function to handle session expiration
export const handleSessionExpiration = () => {
  // 1. Clear tokens
  setAccessToken(null);

  // 2. Update auth state
  useAuthStore.getState().setAuth(null, null);

  // 3. Save current location for return after login
  const currentPath = window.location.pathname;
  if (
    currentPath &&
    currentPath !== Routes.LOGIN &&
    !currentPath.includes("/auth/")
  ) {
    sessionStorage.setItem("returnPath", currentPath);
  }

  // 4. Dispatch event for UI notification
  window.dispatchEvent(new Event("session-expired"));
};
