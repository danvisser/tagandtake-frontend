import { Meta, StoryObj } from "@storybook/react";
import Header from "@src/components/Header";
import { UserRoles } from "@src/types/roles";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Guest: StoryObj<typeof Header> = {
  args: {
    variant: UserRoles.GUEST,
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

