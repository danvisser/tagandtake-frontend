import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";

export interface MemberProfile {
  username: string;
  email: string;
  profile_photo_url?: string | null;
  first_name?: string;
  last_name?: string;
}

export const getMemberProfile = async (): Promise<{
  success: boolean;
  data?: MemberProfile;
  error?: string;
}> => {
  try {
    const { data } = await fetchClient({
      method: "GET",
      url: API_ROUTES.MEMBERS.PROFILE,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Get member profile error:", error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to fetch member profile",
      };
    }
    throw error;
  }
};
