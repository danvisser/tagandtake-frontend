import { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@src/components/ui/tabs";

export default {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
} as Meta<typeof Tabs>;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <div className="w-[420px]">
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
          <TabsTrigger value="three">Three</TabsTrigger>
        </TabsList>
        <TabsContent value="one" className="mt-4">
          Tab one content
        </TabsContent>
        <TabsContent value="two" className="mt-4">
          Tab two content
        </TabsContent>
        <TabsContent value="three" className="mt-4">
          Tab three content
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const Pill: Story = {
  render: () => (
    <div className="w-[420px]">
      <Tabs defaultValue="in-store">
        <TabsList variant="pill">
          <TabsTrigger variant="secondary" value="in-store">
            In Store
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="unlisted">
            Unlisted
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="sold">
            Sold
          </TabsTrigger>
        </TabsList>
        <TabsContent value="in-store" className="mt-4">
          In Store content
        </TabsContent>
        <TabsContent value="unlisted" className="mt-4">
          Unlisted content
        </TabsContent>
        <TabsContent value="sold" className="mt-4">
          Sold content
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const PillOutline: Story = {
  render: () => (
    <div className="w-[420px]">
      <Tabs defaultValue="in-store">
        <TabsList variant="pill">
          <TabsTrigger variant="outline" value="in-store">
            In Store
          </TabsTrigger>
          <TabsTrigger variant="outline" value="unlisted">
            Unlisted
          </TabsTrigger>
          <TabsTrigger variant="outline" value="sold">
            Sold
          </TabsTrigger>
        </TabsList>
        <TabsContent value="in-store" className="mt-4">
          In Store content
        </TabsContent>
        <TabsContent value="unlisted" className="mt-4">
          Unlisted content
        </TabsContent>
        <TabsContent value="sold" className="mt-4">
          Sold content
        </TabsContent>
      </Tabs>
    </div>
  ),
};

