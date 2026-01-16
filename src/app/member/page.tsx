"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { Textarea } from "@src/components/ui/textarea";
import { Separator } from "@src/components/ui/separator";
import { authRequest } from "@src/lib/fetchClient";
import { API_ROUTES } from "@src/constants/apiRoutes";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";

// Define the store profile type based on your serializer
interface StoreProfile {
  store_name: string;
  phone: string | null;
  store_bio: string | null;
  profile_photo_url: string | null;
  google_profile_url: string | null;
  website_url: string | null;
  instagram_url: string | null;
  commission: number;
  stock_limit: number;
  min_listing_days: number;
  min_price: string;
  active_listings_count: number;
  tags_available: number;
  created_at: string;
  updated_at: string;
  store_address?: {
    street_address: string;
    city: string;
    state: string | null;
    postal_code: string;
    country: string;
    latitude: string | null;
    longitude: string | null;
  };
  opening_hours?: Array<{
    day_of_week: string;
    opening_time: string | null;
    closing_time: string | null;
    timezone: string;
    is_closed: boolean;
  }>;
}

export default function StoreSettingsPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <StoreSettingsContent />
    </AuthenticatedPage>
  );
}

function StoreSettingsContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);

  useEffect(() => {
    const fetchStoreProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await authRequest({
          url: API_ROUTES.STORES.PROFILE,
          method: "GET",
        });

        setStoreProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch store profile:", err);
        setError("Failed to load store profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading store settings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 justify-center items-center container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Store Settings</h1>

      {storeProfile && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Store Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="store_name">Store Name</Label>
                  <Input
                    id="store_name"
                    value={storeProfile.store_name}
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={storeProfile.phone || ""} readOnly />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="store_bio">Store Bio</Label>
                  <Textarea
                    id="store_bio"
                    value={storeProfile.store_bio || ""}
                    readOnly
                    className="h-24"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={storeProfile.website_url || ""}
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={storeProfile.instagram_url || ""}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Store Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Commission</p>
                  <p className="text-2xl font-bold">
                    {storeProfile.commission}%
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Stock Limit</p>
                  <p className="text-2xl font-bold">
                    {storeProfile.stock_limit}
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Active Listings
                  </p>
                  <p className="text-2xl font-bold">
                    {storeProfile.active_listings_count}
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Remaining Stock
                  </p>
                  <p className="text-2xl font-bold">
                    {storeProfile.tags_available}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {storeProfile.store_address && (
            <Card>
              <CardHeader>
                <CardTitle>Store Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="street_address">Street Address</Label>
                    <Input
                      id="street_address"
                      value={storeProfile.store_address.street_address}
                      readOnly
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={storeProfile.store_address.city}
                      readOnly
                    />
                  </div>

                  <div>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={storeProfile.store_address.postal_code}
                      readOnly
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={storeProfile.store_address.country}
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
