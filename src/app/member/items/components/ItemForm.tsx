"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

// Add SortableImage component
function SortableImage({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: () => void;
}) {
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
          src={url}
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
  image: File;
}

interface ItemFormProps {
  onSubmit: (data: ItemFormData) => Promise<void>;
  submitButtonText?: string;
  isSubmitting?: boolean;
  errors?: Record<string, string[]>;
  availableCategories?: number[]; // IDs of categories available in the store
  availableConditions?: number[]; // IDs of conditions available in the store
}

export default function ItemForm({
  onSubmit,
  submitButtonText = "Create Item",
  isSubmitting = false,
  errors: externalErrors = {},
  availableCategories,
  availableConditions,
}: ItemFormProps) {
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [errors, setErrors] =
    useState<Record<string, string[]>>(externalErrors);

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

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = imageUrls.indexOf(active.id.toString());
      const newIndex = imageUrls.indexOf(over.id.toString());

      setImages((items) => arrayMove(items, oldIndex, newIndex));
      setImageUrls((items) => arrayMove(items, oldIndex, newIndex));
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

    try {
      await onSubmit({
        name,
        description,
        size,
        price: Number(price),
        condition: Number(condition),
        category: Number(category),
        image: images[0], // API currently only supports one image
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        non_field_errors: ["An unexpected error occurred. Please try again."],
      });
    }
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
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
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
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
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="condition">
                <AccordionTrigger className="text-base">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>Select condition</span>
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
                            className={`px-3 py-1 cursor-pointer ${
                              !isAvailable ? "opacity-50 line-through" : ""
                            }`}
                            onClick={() => {
                              if (!isAvailable) return; // Don't allow selection of unavailable conditions
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
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="category">
                <AccordionTrigger className="text-base">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>Select category</span>
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
                            className={`px-3 py-1 cursor-pointer ${
                              !isAvailable ? "opacity-50 line-through" : ""
                            }`}
                            onClick={() => {
                              if (!isAvailable) return; // Don't allow selection of unavailable categories
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
