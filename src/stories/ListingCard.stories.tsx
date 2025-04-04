import { Meta, StoryObj } from "@storybook/react";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import VacantTagCard from "@src/app/listing/[id]/components/shared/VacantTagCard";
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
import { getStatusMessage } from "@src/app/listing/[id]/utils/statusMessageUtils";
import { ReactNode } from "react";

// Define the StatusMessageContent interface locally
interface StatusMessageContent {
  icon: ReactNode;
  mainText: string;
  secondaryText?: string;
  additionalInfo?: string;
}

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
    | SoldItemListing;
  defaultRole?: ListingRole;
  statusBadge?: {
    label: string;
    variant:
      | "default"
      | "destructive"
      | "secondary"
      | "outline"
      | "secondary-inverse"
      | "destructive-inverse";
  };
  statusMessage?: React.ReactNode | StatusMessageContent;
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

  // Use the utility function to get the status message if not provided
  const message = statusMessage || getStatusMessage(listing, userRole);

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
      </div>

      <ListingCard
        listing={listing}
        statusBadge={statusBadge}
        statusMessage={message}
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

// Separate component for VacantTag
function VacantTagWithRole({
  listing,
  defaultRole,
}: {
  listing: VacantTag;
  defaultRole?: ListingRole;
}) {
  const [userRole, setUserRole] = useState<ListingRole>(
    defaultRole || LISTING_ROLES.VIEWER
  );
  const [isMember, setIsMember] = useState(false);

  // Create a new object with the updated is_member state
  const listingWithMemberState = { ...listing, is_member: isMember };

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
        <button
          className={`px-4 py-2 rounded ${
            isMember ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setIsMember(!isMember)}
        >
          {isMember ? "Member" : "Non-Member"}
        </button>
      </div>

      <VacantTagCard
        listing={listingWithMemberState}
        statusBadge={{
          label: "Available for Listing",
          variant: "outline",
        }}
        footerContent={
          <ListingActions
            listing={listingWithMemberState}
            userRole={userRole}
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
    />
  ),
};

// Add a new story for VacantTag
export const Vacant: Story = {
  render: () => (
    <VacantTagWithRole listing={vacantTag} defaultRole={LISTING_ROLES.VIEWER} />
  ),
};
