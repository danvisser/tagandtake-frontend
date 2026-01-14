import { useState } from "react";

export interface ReverseGeocodingResult {
  displayName: string;
  address: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface ReverseGeocodingState {
  result: ReverseGeocodingResult | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Hook to convert latitude/longitude coordinates to an address
 * Uses Google Geocoding API
 */
export function useReverseGeocoding() {
  const [state, setState] = useState<ReverseGeocodingState>({
    result: null,
    error: null,
    isLoading: false,
  });

  const reverseGeocode = async (
    latitude: number,
    longitude: number
  ): Promise<ReverseGeocodingResult | null> => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setState({
        result: null,
        error: "Google Maps API key is not configured",
        isLoading: false,
      });
      return null;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Using Google Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Reverse geocoding request failed");
      }

      const data = await response.json();

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        setState({
          result: null,
          error: "Could not determine address for this location",
          isLoading: false,
        });
        return null;
      }

      const result = data.results[0];

      // Extract address components
      const addressComponents: Record<string, string> = {};
      result.address_components?.forEach((component: {
        types: string[];
        long_name: string;
      }) => {
        const types = component.types;
        if (types.includes("street_number") || types.includes("route")) {
          addressComponents.street =
            (addressComponents.street || "") +
            (types.includes("street_number") ? component.long_name + " " : "") +
            (types.includes("route") ? component.long_name : "");
        }
        if (types.includes("locality") || types.includes("postal_town")) {
          addressComponents.city = component.long_name;
        }
        if (types.includes("postal_code")) {
          addressComponents.postalCode = component.long_name;
        }
        if (types.includes("country")) {
          addressComponents.country = component.long_name;
        }
      });

      const reverseGeocodingResult: ReverseGeocodingResult = {
        displayName: result.formatted_address,
        address: {
          street: addressComponents.street?.trim() || undefined,
          city: addressComponents.city,
          postalCode: addressComponents.postalCode,
          country: addressComponents.country,
        },
      };

      setState({
        result: reverseGeocodingResult,
        error: null,
        isLoading: false,
      });

      return reverseGeocodingResult;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reverse geocode location. Please try again.";

      setState({
        result: null,
        error: errorMessage,
        isLoading: false,
      });

      return null;
    }
  };

  const reset = () => {
    setState({
      result: null,
      error: null,
      isLoading: false,
    });
  };

  return {
    ...state,
    reverseGeocode,
    reset,
  };
}

