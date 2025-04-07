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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
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
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function ItemsNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagId = searchParams.get("tag_id");

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

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
          <CardDescription>
            Fill in the details below to add a new item to your wardrobe
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
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger
                  className={errors.condition ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {itemConditions.map((condition) => (
                    <SelectItem
                      key={condition.id}
                      value={condition.id.toString()}
                    >
                      {condition.condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.condition && (
                <p className="text-sm text-red-500">{errors.condition[0]}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {itemCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {isSubmitting ? "Creating..." : "Create Item"}
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
    </div>
  );
}
