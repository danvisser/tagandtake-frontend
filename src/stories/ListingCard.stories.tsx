import { Meta, StoryObj } from "@storybook/react";
import { ListingStory } from "./components/ListingStory";
import { mockImages } from "./mockData/listingMocks";

const meta: Meta<typeof ListingStory> = {
  title: "Listings/ListingCard",
  component: ListingStory,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ListingStory>;

export const Active: Story = {
  args: {
    title: "Vintage Denim Jacket",
    price: 100,
    condition: "Excellent",
    category: "Outerwear",
    images: mockImages,
    statusBadge: {
      label: "available",
      variant: "default",
    },
  },
};

export const Recalled: Story = {
  args: {
    title: "Vintage Denim Jacket",
    price: 100,
    condition: "Excellent",
    category: "Outerwear",
    images: mockImages,
    statusBadge: {
      label: "recalled",
      variant: "destructive",
    },
    statusMessage: "This item has been recalled due to quality issues",
  },
};

export const Abandoned: Story = {
  args: {
    title: "Vintage Denim Jacket",
    price: 100,
    condition: "Excellent",
    category: "Outerwear",
    images: mockImages,
    statusBadge: {
      label: "abandoned",
      variant: "destructive",
    },
    statusMessage: "This item has been abandoned due to not being collected",
  },
};

export const Sold: Story = {
  args: {
    title: "Vintage Denim Jacket",
    price: 100,
    condition: "Excellent",
    category: "Outerwear",
    images: mockImages,
    statusBadge: {
      label: "sold",
      variant: "secondary",
    },
    statusMessage: "This item was sold on March 30, 2024",
  },
};

export const Vacant: Story = {
  args: {
    title: "Vacant Tag",
    price: 0,
    condition: "N/A",
    category: "N/A",
    images: [],
    statusBadge: {
      label: "available",
      variant: "outline",
    },
    statusMessage:
      "This tag is currently vacant and available for listing an item",
  },
};
