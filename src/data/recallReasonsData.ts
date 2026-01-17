import { ListingRemovalReason, ListingRemovalReasonType } from "@src/api/listingsApi";

export const recallReasons: ListingRemovalReason[] = [
  {
    id: 1,
    reason: "Incorrect Item Condition",
    type: ListingRemovalReasonType.ISSUE,
    description: "Does not meet condition standards",
  },
  {
    id: 2,
    reason: "Incorrect Item Category",
    type: ListingRemovalReasonType.ISSUE,
    description: "Not an approved category",
  },
  {
    id: 3,
    reason: "Unclean Item",
    type: ListingRemovalReasonType.ISSUE,
    description: "Item is unclean or dirty",
  },
  {
    id: 4,
    reason: "Store Discretion",
    type: ListingRemovalReasonType.STORE_DISCRETION,
    description: "Exceeded listing period guarantee",
  },
  {
    id: 5,
    reason: "Owner Request",
    type: ListingRemovalReasonType.OWNER_REQUEST,
    description: "Owner requested delist",
  },
  {
    id: 6,
    reason: "No Item Attached",
    type: ListingRemovalReasonType.TAG_ERROR,
    description: "No item attached",
  },
];

export function getListingRemovalReasonById(id: number): ListingRemovalReason | undefined {
  return recallReasons.find((reason) => reason.id === id);
}

export function getListingRemovalReasonsByType(
  type: ListingRemovalReasonType
): ListingRemovalReason[] {
  return recallReasons.filter((reason) => reason.type === type);
}
