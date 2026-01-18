"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Item } from "@src/api/itemsApi";
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
import { Card, CardContent } from "@src/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@src/components/ui/alert";
import { AlertCircle, Camera, Plus, X, Info, Tag } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Helper function to convert image URL to File using canvas
// Tries multiple approaches to handle CORS issues
async function urlToFile(url: string): Promise<File> {
  return new Promise((resolve, reject) => {
    // First, try to find if the image is already loaded in the DOM
    const existingImg = document.querySelector(`img[src="${url}"]`) as HTMLImageElement;

    if (existingImg && existingImg.complete) {
      // Image is already loaded, use it directly
      try {
        const canvas = document.createElement('canvas');
        canvas.width = existingImg.naturalWidth || existingImg.width;
        canvas.height = existingImg.naturalHeight || existingImg.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        ctx.drawImage(existingImg, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = url.split('/').pop()?.split('?')[0] || 'image.jpg';
            const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
            resolve(file);
          } else {
            throw new Error('Failed to convert canvas to blob');
          }
        }, 'image/jpeg', 0.95);
        return;
      } catch {
        // Fall through to loading new image
      }
    }

    const img = new window.Image();

    // Try with CORS first
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = url.split('/').pop()?.split('?')[0] || 'image.jpg';
            const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
            resolve(file);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        }, 'image/jpeg', 0.95);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      const img2 = new window.Image();
      img2.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img2.width;
          canvas.height = img2.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          ctx.drawImage(img2, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const fileName = url.split('/').pop()?.split('?')[0] || 'image.jpg';
              const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
              resolve(file);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          }, 'image/jpeg', 0.95);
        } catch (error) {
          reject(error);
        }
      };
      img2.onerror = () => reject(new Error('Failed to load image - CORS issue. Please configure S3 CORS or use a proxy.'));
      // Don't set crossOrigin - try without it
      img2.src = url;
    };

    img.src = url;
  });
}

function SortableImage({
  url,
  index,
  onRemove,
  cacheBust,
}: {
  url: string;
  index: number;
  onRemove: () => void;
  cacheBust?: number;
}) {
  const getImageUrl = (imageUrl: string) => {
    if (!cacheBust || imageUrl.startsWith('blob:')) return imageUrl;
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}_t=${cacheBust}`;
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square touch-none"
      {...attributes}
      {...listeners}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 z-10 h-6 w-6 rounded-full bg-black/40 hover:bg-black/60"
        onClick={onRemove}
      >
        <X className="h-4 w-4 text-white" />
      </Button>
      <div className="w-full h-full relative rounded-md overflow-hidden">
        <Image
          src={getImageUrl(url)}
          alt={`Preview ${index + 1}`}
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

export interface ItemFormData {
  name: string;
  description: string;
  size: string;
  price: number;
  condition: number;
  category: number;
  images: File[];
}

interface ItemFormProps {
  onSubmit: (data: ItemFormData) => Promise<void>;
  submitButtonText?: string;
  isSubmitting?: boolean;
  errors?: Record<string, string[]>;
  availableCategories?: number[]; // IDs of categories available in the store
  availableConditions?: number[]; // IDs of conditions available in the store
  initialItem?: Item; // For editing existing items
  disableCategoryAndCondition?: boolean; // Disable category/condition fields (for listed items)
}

export default function ItemForm({
  onSubmit,
  submitButtonText = "Create Item",
  isSubmitting = false,
  errors: externalErrors = {},
  availableCategories,
  availableConditions,
  initialItem,
  disableCategoryAndCondition = false,
}: ItemFormProps) {
  const [name, setName] = useState(initialItem?.name || "");
  const [description, setDescription] = useState(initialItem?.description || "");
  const [size, setSize] = useState(initialItem?.size || "");
  const [price, setPrice] = useState(initialItem?.price?.toString() || "");
  const [condition, setCondition] = useState(initialItem?.condition?.toString() || "");
  const [category, setCategory] = useState(initialItem?.category?.toString() || "");
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialItem?.images?.map((img: { image_url: string }) => img.image_url) || []
  );
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImageBlobUrls, setNewImageBlobUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>(externalErrors);
  const [imageCacheBust, setImageCacheBust] = useState(Date.now());

  useEffect(() => {
    if (!initialItem) return;

    setName(initialItem.name || "");
    setDescription(initialItem.description || "");
    setSize(initialItem.size || "");
    setPrice(initialItem.price?.toString() || "");
    setCondition(initialItem.condition?.toString() || "");
    setCategory(initialItem.category?.toString() || "");

    const existingUrls =
      initialItem.images?.map((img: { image_url: string }) => img.image_url) || [];
    setImageUrls(existingUrls);
    setImageCacheBust(Date.now());

    setNewImageFiles([]);
    setNewImageBlobUrls((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
  }, [initialItem]);

  // Add sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const currentCount = imageUrls.length;
      const maxImages = 6;

      if (currentCount + newFiles.length > maxImages) {
        const allowedCount = maxImages - currentCount;
        if (allowedCount <= 0) {
          setErrors({
            images: [`Maximum ${maxImages} images allowed. Please remove some images first.`],
          });
          e.target.value = '';
          return;
        }
        const trimmedFiles = newFiles.slice(0, allowedCount);
        const newBlobUrls = trimmedFiles.map((file) => URL.createObjectURL(file));

        setNewImageFiles((prev) => [...prev, ...trimmedFiles]);
        setNewImageBlobUrls((prev) => [...prev, ...newBlobUrls]);
        setImageUrls((prev) => [...prev, ...newBlobUrls]);
        setErrors({
          images: [`Only ${allowedCount} more image(s) can be added. Maximum ${maxImages} images allowed.`],
        });
      } else {
        const newBlobUrls = newFiles.map((file) => URL.createObjectURL(file));

        setNewImageFiles((prev) => [...prev, ...newFiles]);
        setNewImageBlobUrls((prev) => [...prev, ...newBlobUrls]);
        setImageUrls((prev) => [...prev, ...newBlobUrls]);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
      e.target.value = '';
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const urlToRemove = imageUrls[index];

    // If it's a blob URL (new image), remove from new images tracking
    if (urlToRemove.startsWith('blob:')) {
      const blobIndex = newImageBlobUrls.indexOf(urlToRemove);
      if (blobIndex !== -1) {
        setNewImageFiles((prev) => prev.filter((_, i) => i !== blobIndex));
        setNewImageBlobUrls((prev) => prev.filter((_, i) => i !== blobIndex));
        URL.revokeObjectURL(urlToRemove);
      }
    }

    // Remove from display array
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = imageUrls.indexOf(active.id.toString());
      const newIndex = imageUrls.indexOf(over.id.toString());

      // Reorder the display array
      const reorderedUrls = arrayMove(imageUrls, oldIndex, newIndex);
      setImageUrls(reorderedUrls);

      // Also reorder new image files to match
      const reorderedNewFiles: File[] = [];
      const reorderedNewBlobUrls: string[] = [];

      for (const url of reorderedUrls) {
        if (url.startsWith('blob:')) {
          const blobIndex = newImageBlobUrls.indexOf(url);
          if (blobIndex !== -1) {
            reorderedNewFiles.push(newImageFiles[blobIndex]);
            reorderedNewBlobUrls.push(url);
          }
        }
      }

      setNewImageFiles(reorderedNewFiles);
      setNewImageBlobUrls(reorderedNewBlobUrls);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};

    if (!name.trim()) {
      newErrors.name = ["Name is required"];
    }

    if (!description.trim()) {
      newErrors.description = ["Description is required"];
    }

    if (!size.trim()) {
      newErrors.size = ["Size is required"];
    }

    if (!price.trim()) {
      newErrors.price = ["Price is required"];
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = ["Price must be a positive number"];
    }

    if (!disableCategoryAndCondition) {
      if (!condition) {
        newErrors.condition = ["Condition is required"];
      }

      if (!category) {
        newErrors.category = ["Category is required"];
      }
    }

    // Require at least one image
    if (imageUrls.length === 0) {
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

    try {
      // Determine condition and category values
      let conditionNum: number;
      let categoryNum: number;

      if (!disableCategoryAndCondition) {
        // For new items or available items, use form values
        conditionNum = Number(condition);
        categoryNum = Number(category);

        // Double-check they're valid numbers (shouldn't happen due to validation, but safety check)
        if (isNaN(conditionNum) || isNaN(categoryNum)) {
          setErrors({
            condition: isNaN(conditionNum) ? ["Condition is required"] : [],
            category: isNaN(categoryNum) ? ["Category is required"] : [],
          });
          return;
        }
      } else {
        // For listed items, use existing values from initialItem
        if (!initialItem) {
          setErrors({
            non_field_errors: ["Cannot edit item without initial data"],
          });
          return;
        }
        conditionNum = initialItem.condition || 0;
        categoryNum = initialItem.category || 0;
      }

      // Build final images array: existing images (fetch) + new images (already Files)
      const finalImages: File[] = [];

      // Process imageUrls in order
      for (const url of imageUrls) {
        if (url.startsWith('blob:')) {
          // This is a new image - get File from newImageFiles
          const blobIndex = newImageBlobUrls.indexOf(url);
          if (blobIndex !== -1 && blobIndex < newImageFiles.length) {
            finalImages.push(newImageFiles[blobIndex]);
          }
        } else {
          try {
            const cleanUrl = url.split('?')[0].split('&')[0];
            const proxyUrl = `/api/images/proxy?url=${encodeURIComponent(cleanUrl)}`;
            const response = await fetch(proxyUrl, { cache: 'no-store' });

            if (!response.ok) {
              throw new Error(`Failed to fetch via proxy: ${response.statusText}`);
            }

            const blob = await response.blob();
            const fileName = url.split('/').pop()?.split('?')[0] || 'image.jpg';
            const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
            finalImages.push(file);
          } catch (error) {
            console.error('Error fetching image via proxy:', url, error);
            try {
              const file = await urlToFile(url);
              finalImages.push(file);
            } catch (canvasError) {
              console.error('Canvas method also failed:', canvasError);
              setErrors({
                images: [`Failed to process image "${url.split('/').pop()}". Please try removing and re-adding it.`],
              });
              return;
            }
          }
        }
      }

      // Validate we have at least one image
      if (finalImages.length === 0) {
        setErrors({
          images: ["At least one image is required"],
        });
        return;
      }

      const formData: ItemFormData = {
        name,
        description,
        size,
        price: Number(price),
        condition: conditionNum,
        category: categoryNum,
        images: finalImages, // All images in correct order
      };

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        non_field_errors: ["An unexpected error occurred. Please try again."],
      });
    }
  };

  useEffect(() => {
    return () => {
      newImageBlobUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImageBlobUrls]);

  // Get selected condition description
  const selectedCondition = condition
    ? itemConditions.find((c) => c.id.toString() === condition)
    : null;

  // Get selected category description
  const selectedCategory = category
    ? itemCategories.find((c) => c.id.toString() === category)
    : null;

  // Check if a category is available in the store
  const isCategoryAvailable = (categoryId: number) => {
    if (!availableCategories) return true; // If no restrictions, all categories are available
    return availableCategories.includes(categoryId);
  };

  // Check if a condition is available in the store
  const isConditionAvailable = (conditionId: number) => {
    if (!availableConditions) return true; // If no restrictions, all conditions are available
    return availableConditions.includes(conditionId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Images Card - Moved to top */}
      <Card>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="border-2 border-slate-300 border-dashed rounded-md p-6">
              {imageUrls.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Camera className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("images")?.click();
                    }}
                  >
                    Upload photos
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={imageUrls}
                        strategy={rectSortingStrategy}
                      >
                        {imageUrls.map((url, index) => (
                          <SortableImage
                            key={url}
                            url={url}
                            index={index}
                            onRemove={() => removeImage(index)}
                            cacheBust={imageCacheBust}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                    {imageUrls.length < 6 && (
                      <div className="aspect-square flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("images")?.click();
                          }}
                          className="h-12 w-12 rounded-full"
                        >
                          <Plus className="h-6 w-6" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {errors.images && (
              <p className="text-sm text-destructive">{errors.images[0]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information Card */}
      <Card>
        <CardContent className="space-y-6 pt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-md ">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Levis Denim Jacket"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-md">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., gently worn with no stains or tears."
              rows={3}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description[0]}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing and Sizing Card */}
      <Card>
        <CardContent className="space-y-6 pt-4">
          {/* Size */}
          <div className="space-y-2">
            <Label htmlFor="size" className="text-md">
              Size
            </Label>
            <Input
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Any size format accepted"
              className={`text-base ${errors.size ? "border-destructive" : ""}`}
            />
            {errors.size && (
              <p className="text-sm text-destructive">{errors.size[0]}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-md">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="£0.00"
              className={errors.price ? "border-destructive" : ""}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price[0]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Item Details Card */}
      <Card>
        <CardContent className="space-y-6 pt-4">
          {/* Condition */}
          <div className="space-y-2">
            <Accordion
              type="single"
              collapsible={!disableCategoryAndCondition}
              className="w-full"
            >
              <AccordionItem value="condition">
                <AccordionTrigger
                  className={`text-base ${disableCategoryAndCondition ? "cursor-not-allowed opacity-50 pointer-events-none" : ""}`}
                  onClick={(e) => {
                    if (disableCategoryAndCondition) {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }
                  }}
                  onPointerDown={(e) => {
                    if (disableCategoryAndCondition) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Info className={`h-4 w-4 ${disableCategoryAndCondition ? "text-muted-foreground" : ""}`} />
                    <span className={disableCategoryAndCondition ? "text-muted-foreground" : ""}>Select condition</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-2">
                      {itemConditions.map((itemCondition) => {
                        const isAvailable = isConditionAvailable(
                          itemCondition.id
                        );
                        return (
                          <Badge
                            key={itemCondition.id}
                            variant={
                              condition === itemCondition.id.toString()
                                ? "default"
                                : "secondary"
                            }
                            className={`px-3 py-1 ${disableCategoryAndCondition || !isAvailable
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                              }`}
                            onClick={() => {
                              if (disableCategoryAndCondition || !isAvailable) return;
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
                        );
                      })}
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
              <p className="text-sm text-destructive">{errors.condition[0]}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Accordion
              type="single"
              collapsible={!disableCategoryAndCondition}
              className="w-full"
            >
              <AccordionItem value="category">
                <AccordionTrigger
                  className={`text-base ${disableCategoryAndCondition ? "cursor-not-allowed opacity-50 pointer-events-none" : ""}`}
                  onClick={(e) => {
                    if (disableCategoryAndCondition) {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }
                  }}
                  onPointerDown={(e) => {
                    if (disableCategoryAndCondition) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Tag className={`h-4 w-4 ${disableCategoryAndCondition ? "text-muted-foreground" : ""}`} />
                    <span className={disableCategoryAndCondition ? "text-muted-foreground" : ""}>Select category</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-2">
                      {itemCategories.map((itemCategory) => {
                        const isAvailable = isCategoryAvailable(
                          itemCategory.id
                        );
                        return (
                          <Badge
                            key={itemCategory.id}
                            variant={
                              category === itemCategory.id.toString()
                                ? "default"
                                : "secondary"
                            }
                            className={`px-3 py-1 ${disableCategoryAndCondition || !isAvailable
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                              }`}
                            onClick={() => {
                              if (disableCategoryAndCondition || !isAvailable) return;
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
                        );
                      })}
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
              <p className="text-sm text-destructive">{errors.category[0]}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Non-field errors */}
      {errors.non_field_errors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.non_field_errors[0]}</AlertDescription>
        </Alert>
      )}

      {/* Submit button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : submitButtonText}
      </Button>
    </form>
  );
}
