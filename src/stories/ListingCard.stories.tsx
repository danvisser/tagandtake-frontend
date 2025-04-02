import { Meta, StoryObj } from "@storybook/react";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import ListingActions from "@src/app/listing/[id]/components/shared/ListingActions";
import {
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

interface ListingCardWithRoleProps {
  listing:
    | ItemListing
    | RecalledItemListing
    | AbandonedItemListing
    | SoldItemListing
    | VacantTag;
  defaultRole?: ListingRole;
  statusBadge?: {
    label: string;
    variant: "default" | "destructive" | "secondary" | "outline";
  };
  statusMessage?: React.ReactNode;
}

// Wrapper component to handle role state
function ListingCardWithRole({
  defaultRole,
  listing,
  statusBadge,
  statusMessage,
}: ListingCardWithRoleProps) {
  const [userRole, setUserRole] = useState<ListingRole>(
    defaultRole || LISTING_ROLES.VIEWER
  );
  const [isMember, setIsMember] = useState(false);

  // If the listing is a vacant tag, create a new object with the updated is_member state
  const listingWithMemberState =
    "is_member" in listing ? { ...listing, is_member: isMember } : listing;

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
        {"is_member" in listing && (
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
        listing={listingWithMemberState}
        statusBadge={statusBadge}
        statusMessage={statusMessage}
        footerContent={
          <ListingActions
            listing={listingWithMemberState}
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
      statusBadge={{
        label: "Available",
        variant: "default",
      }}
    />
  ),
};

export const Recalled: Story = {
  render: (args) => (
    <ListingCardWithRole
      {...args}
      listing={recalledListing}
      defaultRole={LISTING_ROLES.HOST}
      statusBadge={{
        label: "Recalled",
        variant: "destructive",
      }}
      statusMessage={`This item has been recalled due to: ${recalledListing.reason.reason}`}
    />
  ),
};

export const Abandoned: Story = {
  render: (args) => (
    <ListingCardWithRole
      {...args}
      listing={abandonedListing}
      defaultRole={LISTING_ROLES.HOST}
      statusBadge={{
        label: "Abandoned",
        variant: "destructive",
      }}
      statusMessage={`This item has been abandoned due to: ${abandonedListing.reason.reason}`}
    />
  ),
};

export const Sold: Story = {
  render: (args) => (
    <ListingCardWithRole
      {...args}
      listing={soldListing}
      defaultRole={LISTING_ROLES.HOST}
      statusBadge={{
        label: "Sold",
        variant: "secondary",
      }}
      statusMessage={`This item was sold on ${new Date(soldListing.sold_at).toLocaleDateString()}`}
    />
  ),
};

export const Vacant: Story = {
  render: (args) => (
    <ListingCardWithRole
      {...args}
      listing={vacantTag}
      defaultRole={LISTING_ROLES.VIEWER}
      statusBadge={{
        label: "Available for Listing",
        variant: "outline",
      }}
      statusMessage="This tag is currently vacant and available for listing an item"
    />
  ),
};
