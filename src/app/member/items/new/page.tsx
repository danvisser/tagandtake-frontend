"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createItem } from "@src/api/itemsApi";
import { createListing } from "@src/api/listingsApi";
import { itemCategories, itemConditions } from "@src/data/itemReferenceData";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { Textarea } from "@src/components/ui/textarea";
import { Badge } from "@src/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@src/components/ui/accordion";
import { Checkbox } from "@src/components/ui/checkbox";
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
} from "@src/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@src/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Tag,
  Store,
  Percent,
  FileText,
} from "lucide-react";
import TermsAndConditionsModal from "@src/app/listing/[id]/components/modals/TermsAndConditionsModal";

export default function ItemsNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagId = searchParams.get("tag_id");
  const storeName = searchParams.get("store_name");
  const storeCommission = searchParams.get("commission");
  const isFromListing = !!tagId;

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [createdItemId, setCreatedItemId] = useState<number | null>(null);
  const [listingError, setListingError] = useState<string | null>(null);

  // Terms and conditions state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);

      // Create URLs for preview
      const newUrls = newImages.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Reorder images
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;

    const newImages = [...images];
    const newUrls = [...imageUrls];

    const [movedImage] = newImages.splice(fromIndex, 1);
    const [movedUrl] = newUrls.splice(fromIndex, 1);

    newImages.splice(toIndex, 0, movedImage);
    newUrls.splice(toIndex, 0, movedUrl);

    setImages(newImages);
    setImageUrls(newUrls);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};

    if (!name.trim()) {
      newErrors.name = ["Name is required"];
    }

    if (!price.trim()) {
      newErrors.price = ["Price is required"];
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = ["Price must be a positive number"];
    }

    if (!condition) {
      newErrors.condition = ["Condition is required"];
    }

    if (!category) {
      newErrors.category = ["Category is required"];
    }

    if (images.length === 0) {
      newErrors.images = ["At least one image is required"];
    }

    if (isFromListing && !termsAccepted) {
      newErrors.terms = [
        "You must accept the terms and conditions to list your item",
      ];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setListingError(null);

    try {
      // Create the item
      const itemResponse = await createItem({
        name,
        description,
        size,
        price: Number(price),
        condition: Number(condition),
        category: Number(category),
        image: images[0], // API currently only supports one image
      });

      if (!itemResponse.success || !itemResponse.data) {
        // Convert ItemError to Record<string, string[]>
        const errorObj: Record<string, string[]> = {};
        if (itemResponse.error) {
          Object.entries(itemResponse.error).forEach(([key, value]) => {
            errorObj[key] = value;
          });
        }
        setErrors(errorObj);
        setIsSubmitting(false);
        return;
      }

      const createdItem = itemResponse.data;
      setCreatedItemId(createdItem.id);

      // If tag_id is provided, create a listing
      if (tagId) {
        const listingResponse = await createListing({
          item_id: createdItem.id,
          tag_id: Number(tagId),
        });

        if (!listingResponse.success) {
          setListingError(
            "Item was created but listing failed. You can find your item in your wardrobe."
          );
        }
      }

      // Show success message
      setSuccessMessage(
        tagId && !listingError
          ? "Item created and listed successfully!"
          : "Item created successfully!"
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating item:", error);
      setErrors({
        non_field_errors: ["An unexpected error occurred. Please try again."],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to item page
  const navigateToItem = () => {
    if (createdItemId) {
      router.push(`/items/${createdItemId}`);
    }
  };

  // Navigate to new item page
  const navigateToNewItem = () => {
    router.push("/items/new");
  };

  // Clean up image URLs on unmount
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  // Get selected condition description
  const selectedCondition = condition
    ? itemConditions.find((c) => c.id.toString() === condition)
    : null;

  // Get selected category description
  const selectedCategory = category
    ? itemCategories.find((c) => c.id.toString() === category)
    : null;

  return (
    <div className="container mx-auto py-8 px-4">
      {isFromListing && (
        <Card className="max-w-3xl mx-auto mb-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Listing in {storeName || "Store"}
            </CardTitle>
            <CardDescription>
              You are creating an item to list in this store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Store:</span>
                <span className="text-sm">{storeName || "Unknown Store"}</span>
              </div>
              {storeCommission && (
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Commission:</span>
                  <span className="text-sm">{storeCommission}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
          <CardDescription>
            Fill in the details below to add a new item to your wardrobe
            {isFromListing && " and list it in the store"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter item name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name[0]}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter item description"
                rows={3}
              />
            </div>

            {/* Size */}
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Enter item size (e.g., S, M, L, XL, 42, etc.)"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter item price"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price[0]}</p>
              )}
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="condition">
                  <AccordionTrigger className="text-base">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>
                        {condition
                          ? itemConditions.find(
                              (c) => c.id.toString() === condition
                            )?.condition
                          : "Select condition"}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-3">
                        Select the condition of your item:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {itemConditions.map((itemCondition) => (
                          <Badge
                            key={itemCondition.id}
                            variant={
                              condition === itemCondition.id.toString()
                                ? "default"
                                : "secondary"
                            }
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => {
                              // Toggle selection - if already selected, deselect it
                              if (condition === itemCondition.id.toString()) {
                                setCondition("");
                              } else {
                                setCondition(itemCondition.id.toString());
                              }
                            }}
                          >
                            {itemCondition.condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {selectedCondition && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCondition.description}
                </p>
              )}
              {errors.condition && (
                <p className="text-sm text-red-500">{errors.condition[0]}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger className="text-base">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>
                        {category
                          ? itemCategories.find(
                              (c) => c.id.toString() === category
                            )?.name
                          : "Select category"}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-3">
                        Select the category of your item:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {itemCategories.map((itemCategory) => (
                          <Badge
                            key={itemCategory.id}
                            variant={
                              category === itemCategory.id.toString()
                                ? "default"
                                : "secondary"
                            }
                            className="px-3 py-1 cursor-pointer"
                            onClick={() => {
                              // Toggle selection - if already selected, deselect it
                              if (category === itemCategory.id.toString()) {
                                setCategory("");
                              } else {
                                setCategory(itemCategory.id.toString());
                              }
                            }}
                          >
                            {itemCategory.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {selectedCategory && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCategory.description}
                </p>
              )}
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category[0]}</p>
              )}
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label htmlFor="images">Images *</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className={errors.images ? "border-red-500" : ""}
              />
              {errors.images && (
                <p className="text-sm text-red-500">{errors.images[0]}</p>
              )}

              {/* Image previews */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-32 relative">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded-md"
                          unoptimized
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                          >
                            Remove
                          </Button>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => moveImage(index, index - 1)}
                            >
                              ↑
                            </Button>
                          )}
                          {index < imageUrls.length - 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => moveImage(index, index + 1)}
                            >
                              ↓
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Terms and Conditions - Only show if coming from a listing page */}
            {isFromListing && (
              <div className="space-y-4 border rounded-md p-4 bg-muted/30">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-medium">Terms and Conditions</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    By listing your item, you agree to the following key terms:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      You confirm you own the item and have the right to sell it
                    </li>
                    <li>
                      Items must be clean, safe, and suitable for public display
                    </li>
                    <li>All items are left at your own risk</li>
                    <li>No insurance is provided for listed items</li>
                    <li>Items not collected within 10 days may be forfeited</li>
                  </ul>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                      setTermsAccepted(checked === true)
                    }
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowTermsModal(true);
                      }}
                    >
                      terms and conditions
                    </Button>
                  </Label>
                </div>

                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms[0]}</p>
                )}
              </div>
            )}

            {/* Non-field errors */}
            {errors.non_field_errors && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errors.non_field_errors[0]}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Creating..."
                : isFromListing
                  ? "Create and List Item"
                  : "Create Item"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Success
            </DialogTitle>
            <DialogDescription>{successMessage}</DialogDescription>
          </DialogHeader>

          {listingError && (
            <Alert variant="destructive" className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{listingError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={navigateToNewItem}
              className="w-full sm:w-auto"
            >
              Add Another Item
            </Button>
            <Button onClick={navigateToItem} className="w-full sm:w-auto">
              View Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
}
