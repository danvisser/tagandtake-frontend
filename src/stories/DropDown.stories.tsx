import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@src/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@src/components/ui/dropdown-menu';

export default {
    title: 'Components/DropdownMenu',
    component: DropdownMenu,
    parameters: {
        layout: 'centered',
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
                <DropdownMenuItem>Option 2</DropdownMenuItem>
                <DropdownMenuItem>Option 3</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};
