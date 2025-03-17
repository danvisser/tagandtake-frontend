import { Meta, StoryObj } from "@storybook/react";
import { LISTING_ROLES } from "@src/types/roles";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import { Button } from "@src/components/ui/button";
import { AlertCircle } from "lucide-react";
import {
  activeListing,
  recalledListing,
  abandonedListing,
  soldListing,
  noImagesListing,
  noListing,
} from "./mockData/listingMocks";

const meta: Meta<typeof ListingCard> = {
  title: "Components/ListingCard",
  component: ListingCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ListingCard>;

// Active Listing Variants
export const ActiveListingViewer: Story = {
  args: {
    listing: activeListing,
    userRole: LISTING_ROLES.VIEWER,
    footerContent: <Button>Buy now</Button>,
  },
};

export const ActiveListingOwner: Story = {
  args: {
    listing: activeListing,
    userRole: LISTING_ROLES.OWNER,
    footerContent: <Button variant="outline">Edit</Button>,
  },
};

export const ActiveListingHost: Story = {
  args: {
    listing: activeListing,
    userRole: LISTING_ROLES.HOST,
    footerContent: <Button variant="destructive">Manage</Button>,
  },
};

// Recalled Listing Variants
export const RecalledListingViewer: Story = {
  args: {
    listing: recalledListing,
    userRole: LISTING_ROLES.VIEWER,
    statusMessage: (
      <>
        <AlertCircle />
        <span>Item is no longer for sale</span>
      </>
    ),
    footerContent: (
      <Button variant="ghost" disabled>
        Buy now
      </Button>
    ),
  },
};

export const RecalledListingOwner: Story = {
  args: {
    listing: recalledListing,
    userRole: LISTING_ROLES.OWNER,
    statusMessage: (
      <>
        <AlertCircle />
        <span>Item is no longer for sale</span>
      </>
    ),
    footerContent: (
      <Button variant="ghost" disabled>
        Edit
      </Button>
    ),
  },
};

export const RecalledListingHost: Story = {
  args: {
    listing: recalledListing,
    userRole: LISTING_ROLES.HOST,
    statusMessage: (
      <>
        <AlertCircle />
        <span>Item is no longer for sale</span>
      </>
    ),
    footerContent: <Button variant="secondary">Confirm Collect</Button>,
  },
};

// Abandoned Listing Variants
export const AbandonedListingViewer: Story = {
  args: {
    listing: abandonedListing,
    userRole: LISTING_ROLES.VIEWER,
    statusMessage: (
      <>
        <AlertCircle />
        <span>Item is no longer for sale</span>
      </>
    ),
    footerContent: (
      <Button variant="ghost" disabled>
        Buy now
      </Button>
    ),
  },
};

export const AbandonedListingOwner: Story = {
  args: {
    listing: abandonedListing,
    userRole: LISTING_ROLES.OWNER,
    statusMessage: (
      <>
        <AlertCircle />
        <span>Item is no longer for sale</span>
      </>
    ),
    footerContent: (
      <Button variant="ghost" disabled>
        Edit
      </Button>
    ),
  },
};

export const AbandonedListingHost: Story = {
  args: {
    listing: abandonedListing,
    userRole: LISTING_ROLES.HOST,
    statusMessage: (
      <>
        <AlertCircle />
        <span>Item is no longer for sale</span>
      </>
    ),
    footerContent: <Button variant="outline">Remove tag</Button>,
  },
};

// Sold Listing
export const SoldListingViewer: Story = {
  args: {
    listing: soldListing,
    userRole: LISTING_ROLES.VIEWER,
    statusMessage: (
      <>
        <AlertCircle />
        <span>This item has been sold</span>
      </>
    ),
  },
};

// No Images Listing
export const NoImagesListing: Story = {
  args: {
    listing: noImagesListing,
    userRole: LISTING_ROLES.VIEWER,
    footerContent: <Button>Buy now</Button>,
  },
};

// Vacant Tag (No Listing)
export const VacantTagViewer: Story = {
  args: {
    listing: noListing,
    userRole: LISTING_ROLES.VIEWER,
    statusMessage: <span>This tag is not associated with any listing</span>,
    footerContent: <Button>List item</Button>,
  },
};

// Vacant Tag Host
export const VacantTagHost: Story = {
  args: {
    listing: noListing,
    userRole: LISTING_ROLES.HOST,
    statusMessage: <span>This tag is not associated with any listing</span>,
    footerContent: (
      <Button variant="ghost" disabled>
        Manage
      </Button>
    ),
  },
};
