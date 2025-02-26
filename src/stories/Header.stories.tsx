import { Meta, StoryObj } from "@storybook/react";
import Header from "@src/components/Header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Public: StoryObj<typeof Header> = {
  args: {
    variant: 'public',
  },
};

export const Member: StoryObj<typeof Header> = {
  args: {
    variant: 'member',
  },
};

export const Store: StoryObj<typeof Header> = {
  args: {
    variant: 'store',
  },
};

