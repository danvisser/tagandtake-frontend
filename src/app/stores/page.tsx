"use client";

import { useEffect, useState } from "react";
import { useGeolocation } from "@src/hooks/useGeolocation";
import { useGeocoding } from "@src/hooks/useGeocoding";
import { useStoresNearby } from "@src/hooks/useStoresNearby";
import LoadingSpinner from "@src/components/LoadingSpinner";
import StoreCard from "./components/StoreCard";
import StoreSearchBar from "./components/StoreSearchBar";
import { Alert } from "@src/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
    error: geoError,
    isLoading: isGeoLoading,
  } = useGeolocation({
    autoRequest: true,
    enableHighAccuracy: true,
    timeout: 10000,
  });

  // Geocoding for manual search
  const {
    geocode,
    isLoading: isGeocodingLoading,
    error: geocodingError,
    result: geocodingResult,
  } = useGeocoding();

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

  // Update coordinates when geocoding succeeds
  useEffect(() => {
    if (geocodingResult) {
      setCoordinates({
        latitude: geocodingResult.latitude,
        longitude: geocodingResult.longitude,
      });
    }
  }, [geocodingResult]);

  // Handle manual search
  const handleSearch = async (address: string) => {
    await geocode(address);
  };

  const isLoading = isGeoLoading || isGeocodingLoading || isStoresLoading;

  // Show search bar if geolocation failed/denied and we don't have coordinates
  const shouldShowSearchBar = geoError !== null && coordinates.latitude === null;

  // Show "no stores" if:
  // 1. Not loading AND we have coordinates but no stores found
  const shouldShowNoStores = !isLoading && coordinates.latitude !== null && stores.length === 0;

  // Determine if we should center content (no stores displayed)
  const hasStores = !isLoading && coordinates.latitude !== null && stores.length > 0;
  const shouldCenterContent = !hasStores && (shouldShowSearchBar || shouldShowNoStores || isLoading);

  return (
    <div className={`w-full px-4 py-4 md:container md:mx-auto md:py-8 md:max-w-6xl ${shouldCenterContent ? 'min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center' : ''}`}>
      <div className={hasStores ? 'mb-4 md:mb-8' : 'w-full'}>
        <h1 className={`text-2xl md:text-3xl font-normal ${hasStores ? 'mb-10 md:mb-16' : 'mb-10 md:mb-16 text-center'}`}>Find a Store Near You</h1>

        {shouldShowSearchBar && (
          <div className="space-y-2 md:space-y-3 flex flex-col items-center px-2 md:px-0">
            <StoreSearchBar
              onSearch={handleSearch}
              isLoading={isGeocodingLoading}
              placeholder="Enter an address or postcode"
            />
            {geocodingError && (
              <Alert variant="destructive" className="w-full max-w-6xl">
                <AlertCircle className="h-4 w-4" />
                <p className="ml-2 text-sm">{geocodingError}</p>
              </Alert>
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8 md:py-12">
          <LoadingSpinner size="lg" text="Finding stores near you..." />
        </div>
      )}

      {shouldShowNoStores && (
        <div className="text-center py-8 md:py-12">
          <p className="text-muted-foreground text-sm md:text-base">
            No stores found in your area.
          </p>
        </div>
      )}

      {/* Display stores when found */}
      {hasStores && (
        <div className="space-y-4 md:space-y-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}
