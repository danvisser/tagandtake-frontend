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

export const storeHelpContent: HelpSection[] = [
  {
    title: "Hosting basics",
    subSections: [
      {
        title: "Accepting listings",
        description: "How to accept and list items in your store",
        steps: [
          { text: "Step 1: Scan the tag" },
          { text: "Step 2: Enter item details" },
          { text: "Step 3: Confirm listing" },
        ],
      },
      {
        title: "Managing stock",
        description: "How to manage your listed items and handle recalls",
        steps: [
          { text: "View all active listings" },
          { text: "Edit item details if needed" },
          { text: "Recall items when necessary" },
          { text: "Go to the listing details page" },
          { text: "Click 'Recall Item'" },
          { text: "Provide reason for recall" },
          { text: "Confirm recall" },
        ],
      },
      {
        title: "Processing sales",
        description: "How to process item sales",
        steps: [
          { text: "Scan the tag" },
          { text: "Confirm sale" },
          { text: "Remove tag after sale" },
        ],
      },
      {
        title: "Collections",
        description: "How to handle item collections",
        steps: [
          { text: "Verify member identity" },
          { text: "Scan the tag" },
          { text: "Confirm collection" },
        ],
      },
      {
        title: "Abandoned items",
        description: "How to handle abandoned items",
        steps: [
          { text: "Identify items that have been abandoned" },
          { text: "Remove the tag from the item" },
          { text: "Mark the item as abandoned in the system" },
        ],
      },
    ],
  },
  {
    title: "Troubleshooting",
    subSections: [
      {
        title: "Common issues",
        description: "Solutions to common problems",
        content:
          "If you encounter issues with tags not scanning, check the tag condition and ensure it's properly attached to the item.",
      },
      {
        title: "Replacing tags",
        description:
          "It is common that tags need replacing because they are not scanning or tags are damaged. Here's how to replace them:",
        steps: [
          { text: "Identify the damaged or non-scanning tag" },
          { text: "Go to the listing details page" },
          { text: "Click 'Replace Tag'" },
          { text: "Scan the new tag" },
          { text: "Confirm replacement" },
        ],
      },
      {
        title: "Lost or stolen items",
        description: "What to do if an item is lost or stolen",
        content:
          "If an item goes missing or is stolen from your store, document the incident and contact support immediately. Provide details about when the item was last seen and any relevant information.",
      },
      {
        title: "Damaged items",
        description: "Handling items that are damaged while in store",
        content:
          "If an item is damaged while in your store, document the damage with photos and contact support. The item owner will need to be notified and arrangements made for collection or compensation.",
      },
      {
        title: "Refunds",
        description: "Processing refunds for sold items",
        content:
          "If a refund is required for a sold item, contact support with the listing details and reason for refund. Refunds will be processed according to your store's policy and the platform's terms.",
      },
      {
        title: "Understanding notifications",
        description: "How to read and act on dashboard notifications",
        content:
          "Notifications and badge numbers on your dashboard and listings page are there to notify you when you need to take action. This includes removing tags, handling abandoned items, processing recalls, and other tasks that require your attention. Check these regularly and complete pending tasks promptly.",
      },
      {
        title: "Finding item information",
        description: "How to find information about items for customer disputes or questions",
        content:
          "If you need to handle customer disputes or answer questions about what has happened to an item, you can search for it on the listings page using the search function, or find it in the recent activity section and click 'Item history' to see the full history of that item.",
      },
    ],
  },
  {
    title: "Payments and withdrawals",
    subSections: [
      {
        title: "Managing payments",
        description: "How to view and manage your earnings",
        steps: [
          { text: "Go to Payments section" },
          { text: "View your earnings" },
          { text: "Request withdrawal when ready" },
        ],
      },
    ],
  },
  {
    title: "Account and settings",
    subSections: [
      {
        title: "Updating your profile",
        description: "How to manage your store profile and settings",
        steps: [
          { text: "Go to Hosting Profile" },
          { text: "Update store information" },
          { text: "Save changes" },
        ],
      },
      {
        title: "Hosting rules",
        description: "How to configure your hosting rules",
        content:
          "Set your commission rate, minimum price, maximum items accepted, and other hosting preferences in the Hosting Rules section.",
      },
    ],
  },
];
