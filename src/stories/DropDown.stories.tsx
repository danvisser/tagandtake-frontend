import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@src/components/ui/dropdown-menu";

export default {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof DropdownMenu>;

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Option 2</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Option 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
