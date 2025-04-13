import { ItemCreateData } from "@src/api/itemsApi";

/**
 * Appends item data to a FormData object
 * @param formData The FormData object to append to
 * @param itemData The item data to append
 */
export const appendItemFormData = (
  formData: FormData,
  itemData: ItemCreateData
): void => {
  // Append basic item fields
  formData.append("name", itemData.name);
  if (itemData.description) formData.append("description", itemData.description);
  if (itemData.size) formData.append("size", itemData.size);
  formData.append("price", itemData.price.toString());
  formData.append("condition", itemData.condition.toString());
  formData.append("category", itemData.category.toString());
  
  // Append each image to the FormData
  itemData.images.forEach((image) => {
    formData.append("images", image);  // Django will handle this as a list
  });
};

/**
 * Appends optional item update data to a FormData object
 * @param formData The FormData object to append to
 * @param itemData The item update data to append
 */
export const appendItemUpdateFormData = (
  formData: FormData,
  itemData: Partial<ItemCreateData>
): void => {
  // Append basic item fields if they exist
  if (itemData.name) formData.append("name", itemData.name);
  if (itemData.description) formData.append("description", itemData.description);
  if (itemData.size) formData.append("size", itemData.size);
  if (itemData.price) formData.append("price", itemData.price.toString());
  if (itemData.condition) formData.append("condition", itemData.condition.toString());
  if (itemData.category) formData.append("category", itemData.category.toString());
  
  // Append each image to the FormData if images are provided
  if (itemData.images && itemData.images.length > 0) {
    itemData.images.forEach((image) => {
      formData.append("images", image);  // Django will handle this as a list
    });
  }
};