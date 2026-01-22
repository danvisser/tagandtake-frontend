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
        title: "Listing items",
        description: "How to list items in your store",
        steps: [
          { text: "Step 1: Scan the tag" },
          { text: "Step 2: Enter item details" },
          { text: "Step 3: Confirm listing" },
        ],
      },
      {
        title: "Managing items",
        description: "How to manage your listed items",
        steps: [
          { text: "View all active listings" },
          { text: "Edit item details if needed" },
          { text: "Handle recalls when necessary" },
        ],
      },
    ],
  },
  {
    title: "Collections",
    subSections: [
      {
        title: "Processing collections",
        description: "How to handle item collections",
        steps: [
          { text: "Verify member identity" },
          { text: "Scan the tag" },
          { text: "Confirm collection" },
        ],
      },
    ],
  },
  {
    title: "Sales",
    subSections: [
      {
        title: "Processing sales",
        description: "How to process item sales",
        steps: [
          { text: "Scan the tag" },
          { text: "Confirm sale" },
          { text: "Remove tag after sale" },
        ],
      },
    ],
  },
  {
    title: "Replacing tags",
    subSections: [
      {
        title: "Replacing tags (not scanning/damaged)",
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
    ],
  },
  {
    title: "Dashboard notifications",
    subSections: [
      {
        title: "Understanding notifications",
        description: "How to read and act on dashboard notifications",
        steps: [
          { text: "Check the dashboard regularly" },
          { text: "Review action required items" },
          { text: "Complete pending tasks" },
        ],
      },
    ],
  },
  {
    title: "Listing page",
    subSections: [
      {
        title: "Using the listing page",
        description: "How to navigate and use the listings page",
        content:
          "The listings page shows all your active, recalled, sold, and delisted items. Use the tabs to filter by status.",
      },
    ],
  },
  {
    title: "Recent activity",
    subSections: [
      {
        title: "Viewing activity",
        description: "How to view recent activity in your store",
        content:
          "The recent activity section shows all actions taken on your listings, including sales, collections, and tag replacements.",
      },
    ],
  },
  {
    title: "Payment and withdrawals",
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
