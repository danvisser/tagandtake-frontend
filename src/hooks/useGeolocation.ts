import { useState, useEffect, useCallback } from "react";

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoRequest?: boolean;
}

/**
 * Hook to get user's current geolocation using the browser's Geolocation API
 */
export function useGeolocation(options: GeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    autoRequest = true,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by your browser",
        isLoading: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage = "Failed to get your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions or use the search bar.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred while getting your location.";
            break;
        }

        setState({
          latitude: null,
          longitude: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge]);

  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }
  }, [autoRequest, requestLocation]);

  return {
    ...state,
    requestLocation,
  };
}

