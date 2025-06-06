import { fetchClient } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import axios from "axios";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  message: string;
}

export interface ContactFormError {
  name?: string[];
  email?: string[];
  subject?: string[];
  message?: string[];
  non_field_errors?: string[];
}

export const sendContactForm = async (
  formData: ContactFormData
): Promise<{
  success: boolean;
  data?: ContactResponse;
  error?: ContactFormError;
}> => {
  try {
    const { data } = await fetchClient({
      method: "POST",
      url: API_ROUTES.CONTACT.SUPPORT,
      data: formData,
    });

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    console.error("Contact form submission error:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      return {
        success: false,
        error: error.response.data as ContactFormError,
      };
    }
    throw error;
  }
};
