import { Meta, StoryObj } from "@storybook/react";
import { Input } from "@src/components/ui/input";

export default {
  title: "Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
} as Meta<typeof Input>;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {},
};