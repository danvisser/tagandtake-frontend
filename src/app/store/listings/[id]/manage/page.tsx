"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  Calendar,
  Loader2,
  User,
  Package,
  Tag,
} from "lucide-react";
import { Button } from "@src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { Textarea } from "@src/components/ui/textarea";
import { Label } from "@src/components/ui/label";
import { Alert, AlertDescription } from "@src/components/ui/alert";
import { Input } from "@src/components/ui/input";
import {
  getListing,
  recallListing,
  delistListing,
  replaceListingTag,
  ItemListing,
} from "@src/api/listingsApi";
import { Routes } from "@src/constants/routes";
import { UserRoles } from "@src/types/roles";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import LoadingSpinner from "@src/components/LoadingSpinner";

// Hardcoded recall reasons - these should ideally come from an API
const recallReasons = [
  {
    id: 1,
    reason: "Stock rotation - item has been in store too long",
    type: "store discretion",
  },
  { id: 2, reason: "Damaged during storage", type: "issue" },
  { id: 3, reason: "Item doesn't match description", type: "issue" },
  { id: 4, reason: "Safety concern", type: "issue" },
  { id: 5, reason: "Store policy violation", type: "issue" },
  { id: 6, reason: "Customer complaint", type: "issue" },
  { id: 7, reason: "Space needed for other items", type: "store discretion" },
  { id: 8, reason: "Other", type: "store discretion" },
];

// Hardcoded delist reasons
const delistReasons = [
  { id: 1, reason: "Owner collected item", type: "owner request" },
  { id: 2, reason: "Item sold to customer", type: "owner request" },
  { id: 3, reason: "Other", type: "owner request" },
];

export default function ManageListingPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <ManageListingContent />
    </AuthenticatedPage>
  );
}

function ManageListingContent() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;

  // State management
  const [listing, setListing] = useState<ItemListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [recallDialogOpen, setRecallDialogOpen] = useState(false);
  const [delistDialogOpen, setDelistDialogOpen] = useState(false);
  const [replaceTagDialogOpen, setReplaceTagDialogOpen] = useState(false);
  const [selectedRecallReason, setSelectedRecallReason] = useState("");
  const [selectedDelistReason, setSelectedDelistReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [newTagId, setNewTagId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load listing data on component mount
  useEffect(() => {
    if (listingId) {
      loadListing();
    }
  }, [listingId]);

  const loadListing = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getListing(Number(listingId));

      if (response.success && response.data) {
        setListing(response.data);
      } else {
        setError(response.error || "Failed to load listing");
      }
    } catch (err) {
      console.error("Error loading listing:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecall = async () => {
    if (!listing) return;

    setIsProcessing(true);

    try {
      // For now, we'll use a hardcoded reason ID since we don't have an API to fetch reasons
      // In a real implementation, you'd want to map the selected reason to an actual reason ID
      const reasonId = parseInt(selectedRecallReason);

      const response = await recallListing(listing.id, reasonId);

      if (response.success) {
        // TODO: Add success notification/toast
        console.log("Item recalled successfully");
        setRecallDialogOpen(false);
        // Refresh the listing data
        await loadListing();
      } else {
        // TODO: Add error notification/toast
        console.error("Failed to recall item:", response.error);
        setError(response.error || "Failed to recall item");
      }
    } catch (err) {
      console.error("Error recalling item:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelist = async () => {
    if (!listing) return;

    setIsProcessing(true);

    try {
      // For now, we'll use a hardcoded reason ID
      const reasonId = parseInt(selectedDelistReason);

      const response = await delistListing(listing.id, reasonId);

      if (response.success) {
        // TODO: Add success notification/toast
        console.log("Item delisted successfully");
        setDelistDialogOpen(false);
        // Redirect to listings page
        router.push(Routes.STORE.LISTINGS.ROOT);
      } else {
        // TODO: Add error notification/toast
        console.error("Failed to delist item:", response.error);
        setError(response.error || "Failed to delist item");
      }
    } catch (err) {
      console.error("Error delisting item:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReplaceTag = async () => {
    if (!listing || !newTagId.trim()) return;

    setIsProcessing(true);

    try {
      const response = await replaceListingTag(listing.id, parseInt(newTagId));

      if (response.success) {
        // TODO: Add success notification/toast
        console.log("Tag replaced successfully");
        setReplaceTagDialogOpen(false);
        setNewTagId("");
        // Refresh the listing data
        await loadListing();
      } else {
        // TODO: Add error notification/toast
        console.error("Failed to replace tag:", response.error);
        setError(response.error || "Failed to replace tag");
      }
    } catch (err) {
      console.error("Error replacing tag:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateDaysInStore = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Manage Listing</h1>
                <p className="text-muted-foreground">Tag ID: {listingId}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading listing..." />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Manage Listing</h1>
                <p className="text-muted-foreground">Tag ID: {listingId}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Listing Not Found</h3>
                  <p className="text-muted-foreground">
                    {error ||
                      "The listing you are looking for could not be found."}
                  </p>
                </div>
                <Button onClick={loadListing} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const item = listing.item_details;
  const daysInStore = calculateDaysInStore(listing.created_at);

  // Main content (when listing is loaded successfully)
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Manage Listing</h1>
              <p className="text-muted-foreground">Tag ID: {listing.tag}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Brief Listing Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{item.name}</CardTitle>
              <CardDescription className="mt-2">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Date Added
                    </span>
                    <span className="text-sm font-medium">
                      {formatDate(listing.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Days in Store
                    </span>
                    <span className="text-sm font-medium">
                      {daysInStore} days
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Condition
                    </span>
                    <span className="text-sm font-medium">
                      {item.condition_details?.condition ||
                        `Condition ${item.condition}`}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Choose the appropriate action for this listing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recall Item */}
              <Dialog
                open={recallDialogOpen}
                onOpenChange={setRecallDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive-inverse"
                    className="w-full justify-start"
                    size="lg"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Recall Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Recall Item</DialogTitle>
                    <DialogDescription>
                      Remove this item from your store and return it to the
                      owner. Please specify the reason.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for recall</Label>
                      <Select
                        value={selectedRecallReason}
                        onValueChange={setSelectedRecallReason}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {recallReasons.map((reason) => (
                            <SelectItem
                              key={reason.id}
                              value={reason.id.toString()}
                            >
                              {reason.reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedRecallReason === "8" && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-reason">Please specify</Label>
                        <Textarea
                          id="custom-reason"
                          placeholder="Enter the reason for recall..."
                          value={customReason}
                          onChange={(e) => setCustomReason(e.target.value)}
                        />
                      </div>
                    )}

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        The owner will be notified and asked to collect their
                        item within 10 days.
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setRecallDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleRecall}
                      disabled={
                        !selectedRecallReason ||
                        (selectedRecallReason === "8" &&
                          !customReason.trim()) ||
                        isProcessing
                      }
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Recall Item"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>


              {/* Replace Tag */}
              <Dialog
                open={replaceTagDialogOpen}
                onOpenChange={setReplaceTagDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    size="lg"
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Replace Tag
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Replace Tag</DialogTitle>
                    <DialogDescription>
                      Replace the current tag with a new one. Enter the new tag
                      ID from the physical tag.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-tag-id">New Tag ID</Label>
                      <Input
                        id="new-tag-id"
                        type="number"
                        placeholder="Enter the new tag ID"
                        value={newTagId}
                        onChange={(e) => setNewTagId(e.target.value)}
                        disabled={isProcessing}
                      />
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="font-medium">Current Tag</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tag ID: {listing.tag}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Item: {item.name}
                      </p>
                    </div>

                    <Alert>
                      <Tag className="h-4 w-4" />
                      <AlertDescription>
                        Make sure you have the new physical tag ready and enter
                        the correct tag ID.
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setReplaceTagDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReplaceTag}
                      disabled={!newTagId.trim() || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Replace Tag"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>


              {/* Delist Item */}
              <Dialog
                open={delistDialogOpen}
                onOpenChange={setDelistDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="lg"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Item Collected
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Owner Collection</DialogTitle>
                    <DialogDescription>
                      Mark this item as collected by the owner and remove the
                      listing.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="delist-reason">
                        Reason for delisting
                      </Label>
                      <Select
                        value={selectedDelistReason}
                        onValueChange={setSelectedDelistReason}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {delistReasons.map((reason) => (
                            <SelectItem
                              key={reason.id}
                              value={reason.id.toString()}
                            >
                              {reason.reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="font-medium">Item Details</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tag: {listing.tag}
                      </p>
                    </div>

                    <Alert>
                      <User className="h-4 w-4" />
                      <AlertDescription>
                        This action will permanently remove the listing and mark
                        the exchange as complete.
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDelistDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDelist}
                      disabled={!selectedDelistReason || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Collection"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
