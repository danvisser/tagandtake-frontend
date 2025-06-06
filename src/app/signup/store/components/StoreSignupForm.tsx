"use client";

import * as React from "react";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Textarea } from "@src/components/ui/textarea";
import { StoreSignupCredentials, StoreSignupError } from "@src/api/signupApi";
import { useLoadScript } from "@react-google-maps/api";
import { Checkbox } from "@src/components/ui/checkbox";
import { Label } from "@src/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@src/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@src/lib/utils";
import { useState } from "react";
import LoadingSpinner from "@src/components/LoadingSpinner";

const libraries: ["places"] = ["places"];
const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface StoreSignupFormProps {
  onSubmit: (credentials: StoreSignupCredentials) => Promise<void>;
  errors?: StoreSignupError | null;
}

export default function StoreSignupForm({
  onSubmit,
  errors,
}: StoreSignupFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  // Store details
  const [storeName, setStoreName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [storeBio, setStoreBio] = React.useState("");
  const [websiteUrl, setWebsiteUrl] = React.useState("");
  const [instagramUrl, setInstagramUrl] = React.useState("");
  const [googleProfileUrl, setGoogleProfileUrl] = React.useState("");

  // Address
  const [streetAddress, setStreetAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [country, setCountry] = React.useState("UK");
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);

  // Opening hours
  const [openingHours, setOpeningHours] = React.useState(
    daysOfWeek.map((day) => ({
      day_of_week: day,
      opening_time: "09:00:00",
      closing_time: "17:00:00",
      timezone: "UTC",
      is_closed: day === "sunday",
    }))
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  const [currentTab, setCurrentTab] = React.useState("business");

  // Keep Google Places autocomplete reference at the top level
  // so it works across tabs
  const autocompleteRef = React.useRef<HTMLInputElement>(null);

  // Format time for display (12-hour format with AM/PM)
  const formatTimeLabel = (hour: number, minute: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Generate time options in 30-minute increments
  const timeOptions = React.useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const time = `${formattedHour}:${formattedMinute}`;
        const label = formatTimeLabel(hour, minute);
        options.push({ value: `${time}:00`, label });
      }
    }
    return options;
  }, []);

  // Format time from database format (HH:MM:SS) to display format
  const formatTimeForDisplay = (time: string | undefined) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    return formatTimeLabel(hour, minute);
  };

  // Add this state for tracking overall form submission status
  const [formStatus, setFormStatus] = useState<{
    type: "idle" | "error" | "success";
    message?: string;
  }>({ type: "idle" });

  React.useEffect(() => {
    if (isLoaded && autocompleteRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        autocompleteRef.current,
        { types: ["establishment"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        // Set store details
        setStoreName(place.name || "");
        setGoogleProfileUrl(place.url || "");
        if (place.formatted_phone_number) {
          setPhone(place.formatted_phone_number);
        }
        if (place.website) {
          setWebsiteUrl(place.website);
        }

        // Set latitude and longitude
        setLatitude(place.geometry.location?.lat() || null);
        setLongitude(place.geometry.location?.lng() || null);

        // Extract address components properly
        if (place.address_components) {
          let streetNumber = "";
          let route = "";
          let cityFound = false;

          for (const component of place.address_components) {
            const types = component.types;

            if (types.includes("street_number")) {
              streetNumber = component.long_name;
            } else if (types.includes("route")) {
              route = component.long_name;
            } else if (
              types.includes("locality") ||
              types.includes("postal_town")
            ) {
              setCity(component.long_name);
              cityFound = true;
            } else if (types.includes("administrative_area_level_1")) {
              setState(component.long_name);
            } else if (types.includes("postal_code")) {
              setPostalCode(component.long_name);
            } else if (types.includes("country")) {
              setCountry(component.short_name);
            }
          }

          // If no locality was found, try to find sublocality or neighborhood
          if (!cityFound) {
            for (const component of place.address_components) {
              const types = component.types;
              if (
                types.includes("sublocality") ||
                types.includes("sublocality_level_1") ||
                types.includes("neighborhood")
              ) {
                setCity(component.long_name);
                break;
              }
            }
          }

          // Combine street number and route to form street address
          const formattedStreetAddress = [streetNumber, route]
            .filter(Boolean)
            .join(" ");

          if (formattedStreetAddress) {
            setStreetAddress(formattedStreetAddress);
          } else {
            // Fallback to formatted_address if we couldn't extract street components
            setStreetAddress(place.formatted_address || "");
          }
        } else if (place.formatted_address) {
          // Fallback if address_components is not available
          setStreetAddress(place.formatted_address);
        }

        // Set opening hours if available
        if (place.opening_hours && place.opening_hours.periods) {
          const newHours = [...openingHours];

          place.opening_hours.periods.forEach((period) => {
            const dayIndex = period.open.day;
            const day = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1]; // Convert Sunday=0 to our format

            const openTime = `${period.open.time.substring(0, 2)}:${period.open.time.substring(2, 4)}:00`;
            const closeTime = period.close
              ? `${period.close.time.substring(0, 2)}:${period.close.time.substring(2, 4)}:00`
              : null;

            const hourIndex = newHours.findIndex((h) => h.day_of_week === day);
            if (hourIndex >= 0) {
              newHours[hourIndex] = {
                ...newHours[hourIndex],
                opening_time: openTime,
                closing_time: closeTime || newHours[hourIndex].closing_time,
                is_closed: false,
              };
            }
          });

          setOpeningHours(newHours);
        }
      });
    }
  }, [isLoaded, openingHours]);

  const updateOpeningHours = (
    index: number,
    field: "is_closed" | "opening_time" | "closing_time" | "timezone",
    value: string | boolean
  ) => {
    const updatedHours = [...openingHours];
    const currentHours = updatedHours[index];

    // If updating is_closed flag, just update it
    if (field === "is_closed") {
      updatedHours[index] = {
        ...currentHours,
        [field]: value as boolean,
      };
      setOpeningHours(updatedHours);
      return;
    }

    // For time updates, validate opening < closing
    if (field === "opening_time") {
      // Check if new opening time is before closing time
      if (currentHours.closing_time && value >= currentHours.closing_time) {
        // If invalid, don't update
        alert("Opening time must be before closing time");
        return;
      }
    } else if (field === "closing_time") {
      // Check if closing time is after opening time
      if (currentHours.opening_time && value <= currentHours.opening_time) {
        // If invalid, don't update
        alert("Closing time must be after opening time");
        return;
      }
    }

    // Update the value if validation passes
    updatedHours[index] = {
      ...currentHours,
      [field]: value as string,
    };
    setOpeningHours(updatedHours);
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Reset form status on new submission
    setFormStatus({ type: "idle" });

    // Validate opening hours
    const invalidHours = openingHours.find((hours) => {
      if (hours.is_closed) return false; // Closed days are valid
      return hours.opening_time >= hours.closing_time;
    });

    if (invalidHours) {
      alert(
        `Invalid hours for ${invalidHours.day_of_week}: opening time must be before closing time`
      );
      return;
    }

    setIsLoading(true);

    try {
      // Limit latitude and longitude to 15 decimal places
      const limitedLatitude = latitude
        ? parseFloat(latitude.toFixed(15))
        : undefined;
      const limitedLongitude = longitude
        ? parseFloat(longitude.toFixed(15))
        : undefined;

      const credentials: StoreSignupCredentials = {
        username,
        email,
        password,
        password2,
        store: {
          store_name: storeName,
          phone,
          store_bio: storeBio,
          google_profile_url: googleProfileUrl,
          website_url: websiteUrl,
          instagram_url: instagramUrl,
        },
        store_address: {
          street_address: streetAddress,
          city,
          state,
          postal_code: postalCode,
          country,
          latitude: limitedLatitude,
          longitude: limitedLongitude,
        },
        opening_hours: openingHours,
      };

      await onSubmit(credentials);
    } catch (error) {
      console.error("Store signup form submission failed:", error);
      setFormStatus({
        type: "error",
        message:
          "Signup failed. Please check the form for errors and try again.",
      });
    } finally {
      setIsLoading(false);

      // After submission, if there are errors, navigate to the first tab with errors
      if (errors) {
        setFormStatus({
          type: "error",
          message:
            "Please correct the highlighted fields to complete your signup.",
        });

        if (
          hasFieldError("store") ||
          hasFieldError("store.store_name") ||
          hasFieldError("store.phone") ||
          hasFieldError("store.store_bio") ||
          hasFieldError("store.website_url") ||
          hasFieldError("store.instagram_url")
        ) {
          setCurrentTab("business");
        } else if (
          hasFieldError("store_address") ||
          hasFieldError("store_address.street_address") ||
          hasFieldError("store_address.city") ||
          hasFieldError("store_address.state") ||
          hasFieldError("store_address.postal_code") ||
          hasFieldError("store_address.country")
        ) {
          setCurrentTab("address");
        } else if (hasFieldError("opening_hours")) {
          setCurrentTab("hours");
        } else if (
          hasFieldError("username") ||
          hasFieldError("email") ||
          hasFieldError("password") ||
          hasFieldError("password2")
        ) {
          setCurrentTab("account");
        }
      }
    }
  }

  const renderFieldError = (fieldErrors?: string[]) => {
    if (!fieldErrors || fieldErrors.length === 0) return null;

    return (
      <div className="text-destructive text-sm mt-1">
        {fieldErrors.map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </div>
    );
  };

  // Add this helper function to check if a field has errors
  const hasFieldError = (path: string): boolean => {
    if (!errors) return false;

    // Handle nested paths like "store.website_url"
    const parts = path.split(".");
    let current: unknown = errors;

    for (const part of parts) {
      if (
        typeof current !== "object" ||
        current === null ||
        !(part in (current as Record<string, unknown>))
      ) {
        return false;
      }
      current = (current as Record<string, unknown>)[part];
    }

    return Array.isArray(current) && current.length > 0;
  };

  // Add this helper function to get field error messages
  const getFieldErrors = (path: string): string[] => {
    if (!errors) return [];

    // Handle nested paths like "store.website_url"
    const parts = path.split(".");
    let current: unknown = errors;

    for (const part of parts) {
      if (
        typeof current !== "object" ||
        current === null ||
        !(part in (current as Record<string, unknown>))
      ) {
        return [];
      }
      current = (current as Record<string, unknown>)[part];
    }

    return Array.isArray(current) ? current : [];
  };

  return (
    <div className="grid gap-6">
      {/* Form status notification */}
      {formStatus.type === "error" && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm mb-4 flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Signup Failed</p>
            <p>{formStatus.message}</p>
          </div>
        </div>
      )}

      {/* Non-field errors */}
      {errors?.non_field_errors && (
        <div className="text-destructive px-4 py-3 rounded-md text-sm border border-destructive/20 bg-destructive/10">
          {errors.non_field_errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}

      {/* Google Places search always visible at the top */}
      <div className="space-y-1">
        <Input
          ref={autocompleteRef}
          id="business-search"
          placeholder="Search for your business..."
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={isLoading || !isLoaded}
          className={cn(
            "mb-2",
            hasFieldError("google_search") && "border-destructive"
          )}
        />
        <p className="text-xs text-muted-foreground">
          Can&apos;t find your business? Enter details manually below.
        </p>
      </div>

      <Tabs
        defaultValue="business"
        value={currentTab}
        onValueChange={setCurrentTab}
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger
            value="business"
            className={hasFieldError("store") ? "text-destructive" : ""}
          >
            Business Info
          </TabsTrigger>
          <TabsTrigger
            value="address"
            className={hasFieldError("store_address") ? "text-destructive" : ""}
          >
            Address
          </TabsTrigger>
          <TabsTrigger
            value="hours"
            className={hasFieldError("opening_hours") ? "text-destructive" : ""}
          >
            Hours
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className={
              hasFieldError("username") ||
              hasFieldError("email") ||
              hasFieldError("password") ||
              hasFieldError("password2")
                ? "text-destructive"
                : ""
            }
          >
            Account
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="business" className="space-y-4">
            <h3 className="text-lg font-medium">Business Information</h3>

            <div className="space-y-1">
              <Input
                id="store-name"
                placeholder="Business Name"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className={
                  hasFieldError("store.store_name") ? "border-destructive" : ""
                }
              />
              {renderFieldError(getFieldErrors("store.store_name"))}
            </div>

            <div className="space-y-1">
              <Input
                id="phone"
                placeholder="Phone Number"
                type="tel"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={
                  hasFieldError("store.phone") ? "border-destructive" : ""
                }
              />
              {renderFieldError(getFieldErrors("store.phone"))}
            </div>

            <div className="space-y-1">
              <Textarea
                id="store-bio"
                placeholder="Business Bio"
                disabled={isLoading}
                value={storeBio}
                onChange={(e) => setStoreBio(e.target.value)}
                className={cn(
                  "min-h-[80px]",
                  hasFieldError("store.store_bio") ? "border-destructive" : ""
                )}
                maxLength={255}
              />
              {renderFieldError(getFieldErrors("store.store_bio"))}
            </div>

            <div className="space-y-1">
              <Input
                id="website"
                placeholder="Website URL (optional)"
                type="url"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className={
                  hasFieldError("store.website_url") ? "border-destructive" : ""
                }
              />
              {renderFieldError(getFieldErrors("store.website_url"))}
            </div>

            <div className="space-y-1">
              <Input
                id="instagram"
                placeholder="Instagram URL (optional)"
                type="url"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className={
                  hasFieldError("store.instagram_url")
                    ? "border-destructive"
                    : ""
                }
              />
              {renderFieldError(getFieldErrors("store.instagram_url"))}
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={() => setCurrentTab("address")}>
                Next: Address
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <h3 className="text-lg font-medium">Business Address</h3>

            <div className="space-y-1">
              <Input
                id="street-address"
                placeholder="Street Address"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                required
                className={
                  hasFieldError("store_address.street_address")
                    ? "border-destructive"
                    : ""
                }
              />
              {renderFieldError(getFieldErrors("store_address.street_address"))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input
                  id="city"
                  placeholder="City"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className={
                    hasFieldError("store_address.city")
                      ? "border-destructive"
                      : ""
                  }
                />
                {renderFieldError(getFieldErrors("store_address.city"))}
              </div>
              <div className="space-y-1">
                <Input
                  id="state"
                  placeholder="County (optional)"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={
                    hasFieldError("store_address.state")
                      ? "border-destructive"
                      : ""
                  }
                />
                {renderFieldError(getFieldErrors("store_address.state"))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input
                  id="postal-code"
                  placeholder="Postal Code"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className={
                    hasFieldError("store_address.postal_code")
                      ? "border-destructive"
                      : ""
                  }
                />
                {renderFieldError(getFieldErrors("store_address.postal_code"))}
              </div>
              <div className="space-y-1">
                <Input
                  id="country"
                  placeholder="Country"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className={
                    hasFieldError("store_address.country")
                      ? "border-destructive"
                      : ""
                  }
                />
                {renderFieldError(getFieldErrors("store_address.country"))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentTab("business")}
              >
                Back
              </Button>
              <Button type="button" onClick={() => setCurrentTab("hours")}>
                Next: Hours
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="hours" className="space-y-4">
            <h3 className="text-lg font-medium">Opening Hours</h3>

            {openingHours.map((hours, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24">
                  <Label className="capitalize">{hours.day_of_week}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`closed-${index}`}
                    checked={hours.is_closed}
                    onCheckedChange={(checked) =>
                      updateOpeningHours(index, "is_closed", checked === true)
                    }
                  />
                  <Label htmlFor={`closed-${index}`}>Closed</Label>
                </div>

                {!hours.is_closed && (
                  <>
                    <div className="flex-1">
                      <Select
                        value={hours.opening_time}
                        onValueChange={(value) =>
                          updateOpeningHours(index, "opening_time", value)
                        }
                        disabled={hours.is_closed || isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Opening time">
                            {formatTimeForDisplay(hours.opening_time)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <span>to</span>
                    <div className="flex-1">
                      <Select
                        value={hours.closing_time}
                        onValueChange={(value) =>
                          updateOpeningHours(index, "closing_time", value)
                        }
                        disabled={hours.is_closed || isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Closing time">
                            {formatTimeForDisplay(hours.closing_time)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentTab("address")}
              >
                Back
              </Button>
              <Button type="button" onClick={() => setCurrentTab("account")}>
                Next: Account
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <h3 className="text-lg font-medium">Account Information</h3>

            <div className="space-y-1">
              <Input
                id="username"
                placeholder="Store Username"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={
                  hasFieldError("username") ? "border-destructive" : ""
                }
              />
              {renderFieldError(getFieldErrors("username"))}
            </div>

            <div className="space-y-1">
              <Input
                id="email"
                placeholder="Email"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={hasFieldError("email") ? "border-destructive" : ""}
              />
              {renderFieldError(getFieldErrors("email"))}
            </div>

            <div className="space-y-1 relative">
              <Input
                id="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={
                  hasFieldError("password") ? "border-destructive" : ""
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {renderFieldError(getFieldErrors("password"))}
            </div>

            <div className="space-y-1 relative">
              <Input
                id="password2"
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={isLoading}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                className={
                  hasFieldError("password2") ? "border-destructive" : ""
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {renderFieldError(getFieldErrors("password2"))}
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentTab("hours")}
              >
                Back
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <LoadingSpinner size="sm" text="Creating store..." />
                ) : (
                  "Create Store Account"
                )}
              </Button>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}
