import { Meta, StoryObj } from "@storybook/react";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";
import {
  mockImages,
  activeListing,
  recalledListing,
  abandonedListing,
  soldListing,
  vacantTag,
} from "./mockData/listingMocks";
import { LISTING_ROLES, ListingRole } from "@src/types/roles";
import { useState } from "react";
import {
  ItemListing,
  RecalledItemListing,
  AbandonedItemListing,
  SoldItemListing,
  VacantTag,
} from "@src/api/listingsApi";

const meta: Meta<typeof ListingCard> = {
  title: "Listings/ListingCard",
  component: ListingCard,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/listing/[id]",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ListingCard>;

interface ListingCardWithRoleProps
  extends React.ComponentProps<typeof ListingCard> {
  defaultRole?: ListingRole;
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
    | VacantTag
    | null;
}

// Wrapper component to handle role state
function ListingCardWithRole({
  defaultRole,
  ...props
}: ListingCardWithRoleProps) {
  const [userRole, setUserRole] = useState<ListingRole>(
    defaultRole || LISTING_ROLES.VIEWER
  );
  const [isMember, setIsMember] = useState(false);

  // If the listing is a vacant tag, create a new object with the updated is_member state
  const listing =
    props.listing && "is_member" in props.listing
      ? { ...props.listing, is_member: isMember }
      : props.listing;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Object.values(LISTING_ROLES).map((role) => (
          <button
            key={role}
            className={`px-4 py-2 rounded ${
              userRole === role ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setUserRole(role)}
          >
            {role}
          </button>
        ))}
        {props.listing && "is_member" in props.listing && (
          <button
            className={`px-4 py-2 rounded ${
              isMember ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setIsMember(!isMember)}
          >
            {isMember ? "Member" : "Non-Member"}
          </button>
        )}
      </div>

      <ListingCard
        {...props}
        footerContent={
          <ListingActions
            listing={listing}
            userRole={userRole}
            onCheckout={() => console.log("Checkout clicked")}
            onRemoveTagFromAbandoned={() =>
              console.log("Remove tag from abandoned clicked")
            }
            onRemoveTagFromSold={() =>
              console.log("Remove tag from sold clicked")
            }
            onOpenCollectionModal={() =>
              console.log("Open collection modal clicked")
            }
            onOpenListItemModal={() =>
              console.log("Open list item modal clicked")
            }
          />
        }
      />
    </div>
  );
}

export const Active: Story = {
  render: (args) => (
    <ListingCardWithRole
      {...args}
      listing={activeListing}
      defaultRole={LISTING_ROLES.VIEWER}
    />
  ),
  args: {
    title: "Vintage Denim Jacket",
    price: 100,
    condition: "Excellent",
    category: "Outerwear",
    images: mockImages,
    statusBadge: {
      label: "Available",
      variant: "default",
    },
  },
};

export const Recalled: Story = {
  render: (args) => (
    <ListingCardWithRole
      {...args}
      listing={recalledListing}
      defaultRole={LISTING_ROLES.HOST}
    />
  ),
  args: {
    title: "Vintage Denim Jacket",
    price: 100,
    condition: "Excellent",
    category: "Outerwear",
    images: mockImages,
    statusBadge: {
      label: "Recalled",
      variant: "destructive",
    },
    statusMessage: "This item has been recalled due to quality issues",
  },
};

export const Abandoned: Story = {
  render: (args) => (
    <ListingCardWithRole
      {...args}
      listing={abandonedListing}
      defaultRole={LISTING_ROLES.HOST}
    />
  ),
  args: {
    title: "Vintage Denim Jacket",
    price: 100,
    condition: "Excellent",
    category: "Outerwear",
    images: mockImages,
    statusBadge: {
      label: "Abandoned",
      variant: "destructive",
    },
    statusMessage: "This item has been abandoned due to not being collected",
  },
};

export const Sold: Story = {
  render: (args) => (
    <ListingCardWithRole
      {...args}
      listing={soldListing}
      defaultRole={LISTING_ROLES.HOST}
    />
  ),
  args: {
    title: "Vintage Denim Jacket",
    price: 100,
    condition: "Excellent",
    category: "Outerwear",
    images: mockImages,
    statusBadge: {
      label: "Sold",
      variant: "secondary",
    },
    statusMessage: "This item was sold on March 30, 2024",
  },
};

export const Vacant: Story = {
  render: (args) => (
    <ListingCardWithRole
      {...args}
      listing={vacantTag}
      defaultRole={LISTING_ROLES.VIEWER}
    />
  ),
  args: {
    title: "Vacant Tag",
    price: 0,
    condition: "N/A",
    category: "N/A",
    images: [],
    statusBadge: {
      label: "Available for Listing",
      variant: "outline",
    },
    statusMessage:
      "This tag is currently vacant and available for listing an item",
  },
};
