// Item Status constants matching Django Item.Statuses
export const ITEM_STATUS = {
  AVAILABLE: "available",
  LISTED: "listed",
  RECALLED: "recalled",
  SOLD: "sold",
  ABANDONED: "abandoned",
} as const;

export type ItemStatus = typeof ITEM_STATUS[keyof typeof ITEM_STATUS];
