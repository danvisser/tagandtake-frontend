import { Meta, StoryObj } from "@storybook/react";
import ListingCard from "@src/app/listing/[id]/components/shared/ListingCard";
import { Button } from "@src/components/ui/button";
import {
  activeListing,
  recalledListing,
  abandonedListing,
  soldListing,
  noImagesListing,
  mockImages,
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

// Base story
export const Default: Story = {
  args: {
    title: "Vintage Denim Jacket",
    price: 100,
    condition: "Excellent",
    category: "Outerwear",
    images: mockImages,
  },
};

// With status message
export const WithStatusMessage: Story = {
  args: {
    ...Default.args,
    statusMessage: "This item is no longer for sale",
  },
};

// With status badge
export const WithStatusBadge: Story = {
  args: {
    ...Default.args,
    statusBadge: {
      label: "Sold",
      variant: "destructive",
    },
  },
};

// With footer content
export const WithFooterContent: Story = {
  args: {
    ...Default.args,
    footerContent: <Button>Buy now</Button>,
  },
};

// No images
export const NoImages: Story = {
  args: {
    ...Default.args,
    images: [],
  },
};

// Complete example
export const CompleteExample: Story = {
  args: {
    ...Default.args,
    statusMessage: "This item has been sold",
    statusBadge: {
      label: "Sold",
      variant: "destructive",
    },
    footerContent: (
      <Button variant="ghost" disabled>
        Buy now
      </Button>
    ),
  },
};

// Active Listing Variants
export const ActiveListingViewer: Story = {
  args: {
    title: activeListing.item_details?.name || "",
    price: activeListing.listing_price,
    condition: activeListing.item_details?.condition_details?.condition || "",
    category: activeListing.item_details?.category_details?.name || "",
    images: activeListing.item_details?.images || [],
    footerContent: <Button>Buy now</Button>,
  },
};

export const ActiveListingOwner: Story = {
  args: {
    title: activeListing.item_details?.name || "",
    price: activeListing.listing_price,
    condition: activeListing.item_details?.condition_details?.condition || "",
    category: activeListing.item_details?.category_details?.name || "",
    images: activeListing.item_details?.images || [],
    footerContent: <Button variant="outline">Edit</Button>,
  },
};

export const ActiveListingHost: Story = {
  args: {
    title: activeListing.item_details?.name || "",
    price: activeListing.listing_price,
    condition: activeListing.item_details?.condition_details?.condition || "",
    category: activeListing.item_details?.category_details?.name || "",
    images: activeListing.item_details?.images || [],
    footerContent: <Button variant="destructive">Manage</Button>,
  },
};

// Recalled Listing Variants
export const RecalledListingViewer: Story = {
  args: {
    title: recalledListing.item_details?.name || "",
    price: recalledListing.listing_price,
    condition: recalledListing.item_details?.condition_details?.condition || "",
    category: recalledListing.item_details?.category_details?.name || "",
    images: recalledListing.item_details?.images || [],
    statusMessage: "Item is no longer for sale",
    footerContent: (
      <Button variant="ghost" disabled>
        Buy now
      </Button>
    ),
  },
};

export const RecalledListingOwner: Story = {
  args: {
    title: recalledListing.item_details?.name || "",
    price: recalledListing.listing_price,
    condition: recalledListing.item_details?.condition_details?.condition || "",
    category: recalledListing.item_details?.category_details?.name || "",
    images: recalledListing.item_details?.images || [],
    statusMessage: "Item is no longer for sale",
    footerContent: (
      <Button variant="ghost" disabled>
        Edit
      </Button>
    ),
  },
};

export const RecalledListingHost: Story = {
  args: {
    title: recalledListing.item_details?.name || "",
    price: recalledListing.listing_price,
    condition: recalledListing.item_details?.condition_details?.condition || "",
    category: recalledListing.item_details?.category_details?.name || "",
    images: recalledListing.item_details?.images || [],
    statusMessage: "Item is no longer for sale",
    footerContent: <Button variant="secondary">Confirm Collect</Button>,
  },
};

// Abandoned Listing Variants
export const AbandonedListingViewer: Story = {
  args: {
    title: abandonedListing.item_details?.name || "",
    price: abandonedListing.listing_price,
    condition:
      abandonedListing.item_details?.condition_details?.condition || "",
    category: abandonedListing.item_details?.category_details?.name || "",
    images: abandonedListing.item_details?.images || [],
    statusMessage: "Item is no longer for sale",
    footerContent: (
      <Button variant="ghost" disabled>
        Buy now
      </Button>
    ),
  },
};

export const AbandonedListingOwner: Story = {
  args: {
    title: abandonedListing.item_details?.name || "",
    price: abandonedListing.listing_price,
    condition:
      abandonedListing.item_details?.condition_details?.condition || "",
    category: abandonedListing.item_details?.category_details?.name || "",
    images: abandonedListing.item_details?.images || [],
    statusMessage: "Item is no longer for sale",
    footerContent: (
      <Button variant="ghost" disabled>
        Edit
      </Button>
    ),
  },
};

export const AbandonedListingHost: Story = {
  args: {
    title: abandonedListing.item_details?.name || "",
    price: abandonedListing.listing_price,
    condition:
      abandonedListing.item_details?.condition_details?.condition || "",
    category: abandonedListing.item_details?.category_details?.name || "",
    images: abandonedListing.item_details?.images || [],
    statusMessage: "Item is no longer for sale",
    footerContent: <Button variant="outline">Remove tag</Button>,
  },
};

// Sold Listing
export const SoldListingViewer: Story = {
  args: {
    title: soldListing.item_details?.name || "",
    price: soldListing.listing_price,
    condition: soldListing.item_details?.condition_details?.condition || "",
    category: soldListing.item_details?.category_details?.name || "",
    images: soldListing.item_details?.images || [],
    statusMessage: "This item has been sold",
    statusBadge: {
      label: "Sold",
      variant: "destructive",
    },
  },
};

// No Images Listing
export const NoImagesListing: Story = {
  args: {
    title: noImagesListing.item_details?.name || "",
    price: noImagesListing.listing_price,
    condition: noImagesListing.item_details?.condition_details?.condition || "",
    category: noImagesListing.item_details?.category_details?.name || "",
    images: [],
    footerContent: <Button>Buy now</Button>,
  },
};
