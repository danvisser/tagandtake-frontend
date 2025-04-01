import { Meta, StoryObj } from "@storybook/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@src/components/ui/hover-card";

export default {
  title: "Components/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
  },
} as Meta<typeof HoverCard>;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard openDelay={100} closeDelay={50}>
      <HoverCardTrigger>Hover me</HoverCardTrigger>
      <HoverCardContent>
        <div>
          <h4>@hovercard</h4>
          <p>
            Hover cards are used to show additional information when hovering
            over an element.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <HoverCard openDelay={100} closeDelay={50}>
      <HoverCardTrigger>Hover for details</HoverCardTrigger>
      <HoverCardContent>
        <div>
          <h4>Detailed Information</h4>
          <p>
            This is a longer piece of content that demonstrates how the hover
            card handles multiple lines of text and maintains a clean layout.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithList: Story = {
  render: () => (
    <HoverCard openDelay={100} closeDelay={50}>
      <HoverCardTrigger>Hover for list</HoverCardTrigger>
      <HoverCardContent>
        <div>
          <h4>List of Items</h4>
          <ul>
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
