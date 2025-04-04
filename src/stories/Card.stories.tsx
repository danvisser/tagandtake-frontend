import { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "borderless"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Basic card with all subcomponents
export const Default: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card. You can put any content here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

// Borderless variant
export const Borderless: Story = {
  args: {
    variant: "borderless",
  },
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Borderless Card</CardTitle>
        <CardDescription>This card has no border</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Borderless cards are useful for a cleaner look in certain contexts.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button className="ml-2">Submit</Button>
      </CardFooter>
    </Card>
  ),
};

// Card with only header and content
export const NoFooter: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Card Without Footer</CardTitle>
        <CardDescription>Sometimes you don&apos;t need a footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card demonstrates that you can use only the components you need.</p>
      </CardContent>
    </Card>
  ),
};

// Card with only content
export const ContentOnly: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardContent className="pt-6">
        <p>This card only has content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

// Card with custom styling
export const CustomStyling: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Card className="w-[350px] bg-gradient-to-br from-blue-50 to-indigo-50" {...args}>
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="text-blue-700">Custom Styled Card</CardTitle>
        <CardDescription className="text-blue-500">With custom colors and styling</CardDescription>
      </CardHeader>
      <CardContent className="py-6">
        <p>You can apply custom classes to any card component to match your design system.</p>
      </CardContent>
      <CardFooter className="border-t border-blue-100">
        <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">Cancel</Button>
        <Button className="ml-2 bg-blue-600 hover:bg-blue-700">Submit</Button>
      </CardFooter>
    </Card>
  ),
};