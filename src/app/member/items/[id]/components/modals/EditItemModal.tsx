"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Item, updateItem, ItemUpdateData } from "@src/api/itemsApi";
import ItemForm, { ItemFormData } from "@src/app/member/items/components/ItemForm";
import { useToast } from "@src/hooks/use-toast";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  onSuccess: () => void;
  disableCategoryAndCondition?: boolean; // For listed items
}

export default function EditItemModal({
  isOpen,
  onClose,
  item,
  onSuccess,
  disableCategoryAndCondition = false,
}: EditItemModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formKey, setFormKey] = useState(Date.now());
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setIsSubmitting(false);
      setFormKey(Date.now());
    }
  }, [isOpen, item.id]);

  const handleSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const updateData: ItemUpdateData = {
        name: data.name,
        description: data.description,
        attributes: data.attributes,
        price: data.price,
        images: data.images,
      };

      if (!disableCategoryAndCondition) {
        updateData.category = data.category;
        updateData.condition = data.condition;
      }

      const response = await updateItem(item.id, updateData);

      if (!response.success) {
        const errorObj: Record<string, string[]> = {};
        if (response.error) {
          Object.entries(response.error).forEach(([key, value]) => {
            errorObj[key] = value;
          });
        }
        setErrors(errorObj);
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Item updated",
        description: "Your item has been successfully updated.",
      });

      setIsSubmitting(false);
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error updating item:", error);
      setErrors({
        non_field_errors: ["An unexpected error occurred. Please try again."],
      });
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">Edit Item</DialogTitle>
          <DialogDescription>
            {disableCategoryAndCondition
              ? "Category and condition cannot be changed for listed items."
              : ""}
          </DialogDescription>
        </DialogHeader>

        <ItemForm
          key={formKey}
          onSubmit={handleSubmit}
          submitButtonText="Save Changes"
          isSubmitting={isSubmitting}
          errors={errors}
          initialItem={item}
          disableCategoryAndCondition={disableCategoryAndCondition}
        />
      </DialogContent>
    </Dialog>
  );
}
