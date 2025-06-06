// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@src/components/ui/button';

// Define the meta configuration for the Button component
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered', // Centers all stories in this component
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    asChild: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'default',
    size: 'default',
    asChild: false,
    children: 'Primary Button',
  },
};

// Destructive button story
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'default',
    asChild: false,
    children: 'Destructive Button',
  },
};

// Outline button story
export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    asChild: false,
    children: 'Outline Button',
  },
};

// Secondary button story
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'default',
    asChild: false,
    children: 'Secondary Button',
  },
};

// Destructive inverse button story
export const DestructiveInverse: Story = {
  args: {
    variant: "destructive-inverse",
    size: "default",
    asChild: false,
    children: "Destructive Inverse Button",
  },
};

// Secondary button story
export const SecondaryInverse: Story = {
  args: {
    variant: "secondary-inverse",
    size: "default",
    asChild: false,
    children: "Secondary Inverse Button",
  },
};

// Ghost button story
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    asChild: false,
    children: 'Ghost Button',
  },
};

// Link button story
export const Link: Story = {
  args: {
    variant: 'link',
    size: 'default',
    asChild: false,
    children: 'Link Button',
  },
};

// Small button story
export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm',
    asChild: false,
    children: 'Small Button',
  },
};

// Large button story
export const Large: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    asChild: false,
    children: 'Large Button',
  },
};

// Icon button story
export const IconButton: Story = {
  args: {
    variant: 'default',
    size: 'icon',
    asChild: false,
    children: '🔍', // Replace with an actual icon component as needed
  },
};

// Disabled button story
export const Disabled: Story = {
  args: {
    variant: 'default',
    size: 'default',
    asChild: false,
    disabled: true,
    children: 'Disabled Button',
  },
};
