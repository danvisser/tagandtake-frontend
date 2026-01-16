import { RecallReason, RecallReasonType } from "@src/api/listingsApi";

export const recallReasons: RecallReason[] = [
  {
    id: 1,
    reason: "IncorrectItem Condition",
    type: RecallReasonType.ISSUE,
    description: "Item does not meet store's condition standards",
  },
  {
    id: 2,
    reason: "Incorrect Item Category",
    type: RecallReasonType.ISSUE,
    description: "Item category is not one of the store's approved categories",
  },
  {
    id: 3,
    reason: "Unclean Item",
    type: RecallReasonType.ISSUE,
    description: "Item is unclean or dirty",
  },
  {
    id: 4,
    reason: "Store Discretion",
    type: RecallReasonType.STORE_DISCRETION,
    description:
      "Item has exceeded the store's listing period guarantee and is being recalled",
  },
  {
    id: 5,
    reason: "Owner Request",
    type: RecallReasonType.OWNER_REQUEST,
    description: "Owner has requested to recall their item",
  },
  {
    id: 6,
    reason: "No Item Attached",
    type: RecallReasonType.TAG_ERROR,
    description: "No item is attached to the tag",
  },
];

export function getRecallReasonById(id: number): RecallReason | undefined {
  return recallReasons.find((reason) => reason.id === id);
}

export function getRecallReasonsByType(
  type: RecallReasonType
): RecallReason[] {
  return recallReasons.filter((reason) => reason.type === type);
}
