"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createItem } from "@src/api/itemsApi";
import { Button } from "@src/components/ui/button";
import { Routes } from "@src/constants/routes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import ItemForm, { ItemFormData } from "../components/ItemForm";

export default function ItemsNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [createdItemId, setCreatedItemId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formKey, setFormKey] = useState(0);

  // Handle form submission
  const handleSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // Create the item
      const itemResponse = await createItem({
        name: data.name,
        description: data.description,
        size: data.size,
        price: data.price,
        condition: data.condition,
        category: data.category,
        images: data.images,
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

      // Show success message
      setSuccessMessage("Item created successfully!");
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
      router.push(Routes.MEMBER.ITEMS.DETAILS(createdItemId.toString()));
    }
  };

  // Reset form and prepare for new item
  const navigateToNewItem = () => {
    // Close the success modal
    setShowSuccessModal(false);
    // Reset all state
    setCreatedItemId(null);
    setSuccessMessage("");
    setErrors({});
    setIsSubmitting(false);
    // Force form remount by changing key
    setFormKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-2 max-w-3xl mx-auto mb-6">
        <span className="text-2xl font-medium">Add to Wardrobe</span>
        <p className="text-muted-foreground">
          Upload your item now and simply click to list in your chosen host
        </p>
      </div>

      <ItemForm
        key={formKey}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errors={errors}
      />

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
