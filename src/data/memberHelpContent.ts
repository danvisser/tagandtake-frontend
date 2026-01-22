export interface HelpStep {
  text: string;
}

export interface HelpSubSection {
  title: string;
  description?: string; // Optional introductory text
  steps?: HelpStep[]; // Optional step-by-step instructions
  content?: string; // Optional paragraph content
}

export interface HelpSection {
  title: string;
  subSections: HelpSubSection[];
}

export const memberHelpContent: HelpSection[] = [
  {
    title: "Selling basics",
    subSections: [
      {
        title: "How to sell",
        description: "Learn how to list and sell your items",
        steps: [
          { text: "Create an item listing with photos and details" },
          { text: "Find a participating store near you" },
          { text: "Take your item to the store with the listing" },
          { text: "The store will scan the tag and list your item" },
          { text: "Your item will appear on the marketplace" },
        ],
      },
      {
        title: "Updating listings",
        description: "How to update your item listings",
        steps: [
          { text: "Go to your items page" },
          { text: "Select the item you want to update" },
          { text: "Edit the details, price, or photos" },
          { text: "Save your changes" },
        ],
      },
      {
        title: "Collecting listings (delisting)",
        description: "How to collect your item from a store",
        steps: [
          { text: "Go to your items page and find the item in store" },
          { text: "Visit the store where your item is listed" },
          { text: "Provide your collection PIN if required" },
          { text: "The store will scan the tag and return your item" },
          { text: "Your listing will be removed from the marketplace" },
        ],
      },
    ],
  },
  {
    title: "Item recalls",
    subSections: [
      {
        title: "Understanding recalls",
        description: "What happens when your item is recalled",
        content:
          "Stores may recall items for various reasons such as damage, policy violations, or other issues. When your item is recalled, you'll receive a notification and need to collect it within the specified deadline.",
      },
      {
        title: "Collecting recalled items",
        description: "How to collect an item that has been recalled",
        steps: [
          { text: "Check your notifications for recall details" },
          { text: "Note the collection deadline" },
          { text: "Visit the store before the deadline" },
          { text: "Use your collection PIN if provided" },
          { text: "Collect your item from the store" },
        ],
      },
    ],
  },
  {
    title: "Payment and withdrawals",
    subSections: [
      {
        title: "How payments work",
        description: "Understanding your earnings",
        content:
          "When your item sells, you'll receive payment minus the store's commission and any transaction fees. Payments are processed securely and can be withdrawn to your account.",
      },
      {
        title: "Withdrawing funds",
        description: "How to withdraw your earnings",
        steps: [
          { text: "Go to the payments page" },
          { text: "View your available balance" },
          { text: "Request a withdrawal" },
          { text: "Funds will be transferred to your account" },
        ],
      },
    ],
  },
  {
    title: "Account and settings",
    subSections: [
      {
        title: "Managing your account",
        description: "Update your account information",
        steps: [
          { text: "Go to account settings" },
          { text: "Update your email address" },
          { text: "Change your password if needed" },
          { text: "Update your profile photo" },
        ],
      },
      {
        title: "Account deletion",
        description: "How to delete your account",
        content:
          "You can delete your account from the settings page. Note that you must collect all items from stores before your account can be deleted. If you have active or recalled listings, the delete option will be disabled until all items are collected.",
      },
    ],
  },
];
