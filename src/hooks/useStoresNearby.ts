import { useState, useEffect, useCallback } from "react";
import { getPublicStores, PublicStore, StoreListResponse } from "@src/api/storeApi";

export interface StoresNearbyState {
  stores: PublicStore[];
  isLoading: boolean;
  error: string | null;
}

export interface StoresNearbyParams {
  latitude: number | null;
  longitude: number | null;
  categoryIds?: number[];
  conditionIds?: number[];
}

/**
 * Hook to fetch stores near a given location
 */
export function useStoresNearby(params: StoresNearbyParams) {
  const { latitude, longitude, categoryIds, conditionIds } = params;

  const [state, setState] = useState<StoresNearbyState>({
    stores: [],
    isLoading: false,
    error: null,
  });

  const fetchStores = useCallback(async () => {
    // Only fetch if we have coordinates
    if (latitude === null || longitude === null) {
      setState({
        stores: [],
        isLoading: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Build query params
      const queryParams: Record<string, string> = {
        lat: latitude.toString(),
        long: longitude.toString(), // Backend uses 'long' not 'lon'
      };

      if (categoryIds && categoryIds.length > 0) {
        queryParams.category = categoryIds.join(",");
      }

      if (conditionIds && conditionIds.length > 0) {
        queryParams.condition = conditionIds.join(",");
      }

      const response = await getPublicStores(queryParams);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch stores");
      }

      const data = response.data as StoreListResponse;

      setState({
        stores: data?.results || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch nearby stores. Please try again.";

      setState({
        stores: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  }, [latitude, longitude, categoryIds, conditionIds]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    ...state,
    refetch: fetchStores,
  };
}

