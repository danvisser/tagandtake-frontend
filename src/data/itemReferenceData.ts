export interface ItemCategory {
  id: number;
  name: string;
  description: string;
}

export interface ItemCondition {
  id: number;
  condition: string;
  description: string;
}

export const itemCategories: ItemCategory[] = [
  { id: 1, name: "Tops", description: "Upper body garments" },
  { id: 2, name: "Bottoms", description: "Lower body garments" },
  { id: 3, name: "Dresses & Jumpsuits", description: "One-piece garments" },
  {
    id: 4,
    name: "Outerwear",
    description: "Clothing worn over other clothing",
  },
  { id: 5, name: "Footwear", description: "Shoes, boots, sandals, etc." },
  { id: 6, name: "Accessories", description: "Bags, belts, hats, etc." },
  { id: 7, name: "Activewear", description: "Sports and gym clothing" },
  { id: 8, name: "Swimwear", description: "Clothing for swimming" },
  {
    id: 9,
    name: "Sleepwear & Loungewear",
    description: "Clothing for sleeping and lounging",
  },
  { id: 10, name: "Underwear & Intimates", description: "Undergarments" },
];

export const itemConditions: ItemCondition[] = [
  { id: 1, condition: "New", description: "Never worn, with tags" },
  {
    id: 2,
    condition: "Like New",
    description: "Worn once or twice, no signs of wear",
  },
  {
    id: 3,
    condition: "Gently Used",
    description: "Worn a few times, minimal signs of wear",
  },
  {
    id: 4,
    condition: "Fair",
    description: "Visible signs of wear, but still in good condition",
  },
  { id: 5, condition: "Needs Repair", description: "Minor repairs needed" },
];

export function getCategoryById(id: number): ItemCategory | undefined {
  return itemCategories.find((category) => category.id === id);
}

export function getConditionById(id: number): ItemCondition | undefined {
  return itemConditions.find((condition) => condition.id === id);
}
