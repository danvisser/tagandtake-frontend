import { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a dialog component with responsive styling.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            The dialog is designed to be responsive on all screen sizes. On
            mobile, it takes up 90% of the screen width with appropriate
            padding.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithCustomWidth: Story = {
  render: () => (
    <Dialog open={true}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Custom Width Dialog</DialogTitle>
          <DialogDescription>
            This dialog has a custom maximum width of 425px.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            You can customize the width of the dialog by adding a max-width
            class.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog with Long Content</DialogTitle>
          <DialogDescription>
            This dialog contains a lot of content to demonstrate scrolling
            behavior.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[300px] overflow-y-auto">
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget
            aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
            tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
          </p>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget
            aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
            tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
          </p>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget
            aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
            tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
          </p>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget
            aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
            tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog open={true}>
      <DialogContent hideCloseButton>
        <DialogHeader>
          <DialogTitle>Dialog Without Close Button</DialogTitle>
          <DialogDescription>
            This dialog doesn&apos;t have a close button in the top-right corner.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            You can hide the close button by setting the hideCloseButton prop to
            true.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
