import { useState, useEffect, useCallback } from "react";
import { getPublicStores, PublicStore, StoreListResponse } from "@src/api/storeApi";

export interface StoresNearbyState {
  stores: PublicStore[];
  isLoading: boolean;
  error: string | null;
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
}

export interface StoresNearbyParams {
  latitude: number | null;
  longitude: number | null;
  categoryIds?: number[];
  conditionIds?: number[];
  page?: number;
}

/**
 * Hook to fetch stores near a given location
 */
export function useStoresNearby(params: StoresNearbyParams) {
  const { latitude, longitude, categoryIds, conditionIds, page = 1 } = params;

  const [state, setState] = useState<StoresNearbyState>({
    stores: [],
    isLoading: false,
    error: null,
    count: 0,
    page: 1,
    page_size: 20,
    total_pages: 1,
    next: null,
    previous: null,
  });

  const fetchStores = useCallback(async () => {
    // Only fetch if we have coordinates
    if (latitude === null || longitude === null) {
      setState({
        stores: [],
        isLoading: false,
        error: null,
        count: 0,
        page: 1,
        page_size: 20,
        total_pages: 1,
        next: null,
        previous: null,
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

      if (page > 1) {
        queryParams.page = page.toString();
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
        count: data?.count || 0,
        page: data?.page || 1,
        page_size: data?.page_size || 20,
        total_pages: data?.total_pages || 1,
        next: data?.next || null,
        previous: data?.previous || null,
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
        count: 0,
        page: 1,
        page_size: 20,
        total_pages: 1,
        next: null,
        previous: null,
      });
    }
  }, [latitude, longitude, categoryIds, conditionIds, page]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    ...state,
    refetch: fetchStores,
  };
}

