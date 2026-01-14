import { useState } from "react";

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface GeocodingState {
  result: GeocodingResult | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Hook to convert an address or postcode to latitude/longitude coordinates
 * Uses Google Geocoding API
 */
export function useGeocoding() {
  const [state, setState] = useState<GeocodingState>({
    result: null,
    error: null,
    isLoading: false,
  });

  const geocode = async (address: string): Promise<GeocodingResult | null> => {
    if (!address.trim()) {
      setState({
        result: null,
        error: "Please enter an address or postcode",
        isLoading: false,
      });
      return null;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setState({
        result: null,
        error: "Unable to fetch addresses. Please try again or allow location.",
        isLoading: false,
      });
      return null;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Using Google Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Geocoding request failed");
      }

      const data = await response.json();

      // Handle different Google Geocoding API status codes
      if (data.status === "ZERO_RESULTS") {
        setState({
          result: null,
          error: "Could not find a location for that address. Please try a different address or postcode.",
          isLoading: false,
        });
        return null;
      }

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        let errorMessage = "Could not find a location for that address. Please try a different address or postcode.";

        if (data.status === "OVER_QUERY_LIMIT") {
          errorMessage = "Unable to fetch addresses. Please try again later.";
        } else if (data.status === "REQUEST_DENIED") {
          errorMessage = "Unable to fetch addresses. Please try again or allow location.";
        } else if (data.status === "INVALID_REQUEST") {
          errorMessage = "Invalid address format. Please check your input and try again.";
        }

        setState({
          result: null,
          error: errorMessage,
          isLoading: false,
        });
        return null;
      }

      const result = data.results[0];
      const location = result.geometry.location;

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

      const geocodingResult: GeocodingResult = {
        latitude: location.lat,
        longitude: location.lng,
        displayName: result.formatted_address,
        address: {
          street: addressComponents.street?.trim() || undefined,
          city: addressComponents.city,
          postalCode: addressComponents.postalCode,
          country: addressComponents.country,
        },
      };

      setState({
        result: geocodingResult,
        error: null,
        isLoading: false,
      });

      return geocodingResult;
    } catch {
      setState({
        result: null,
        error: "Unable to fetch addresses. Please try again or allow location.",
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
    geocode,
    reset,
  };
}

