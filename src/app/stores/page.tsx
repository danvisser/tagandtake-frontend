"use client";

import { useEffect, useState } from "react";
import { useGeolocation } from "@src/hooks/useGeolocation";
import { useStoresNearby } from "@src/hooks/useStoresNearby";
import LoadingSpinner from "@src/components/LoadingSpinner";
import StoreCard from "./components/StoreCard";

export default function StoreFinder() {
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  // Request location on page load
  const {
    latitude: geoLat,
    longitude: geoLon,
    isLoading: isGeoLoading,
  } = useGeolocation({
    autoRequest: true,
    enableHighAccuracy: true,
    timeout: 10000,
  });

  // Only fetch stores if we have coordinates (won't query if coordinates are null)
  const {
    stores,
    isLoading: isStoresLoading,
  } = useStoresNearby({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  });

  // Update coordinates when geolocation succeeds
  useEffect(() => {
    if (geoLat !== null && geoLon !== null) {
      setCoordinates({ latitude: geoLat, longitude: geoLon });
    }
  }, [geoLat, geoLon]);

  const isLoading = isGeoLoading || isStoresLoading;

  // Show "no stores" if:
  // 1. Not loading AND we don't have coordinates (geolocation failed/denied), OR
  // 2. Not loading AND we have coordinates but no stores found
  const shouldShowNoStores =
    !isLoading &&
    (coordinates.latitude === null || stores.length === 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find a Store Near Me</h1>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Finding stores near you..." />
        </div>
      )}

      {shouldShowNoStores && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No stores found in your area.
          </p>
        </div>
      )}

      {/* Display stores when found */}
      {!isLoading && coordinates.latitude !== null && stores.length > 0 && (
        <div className="space-y-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}
