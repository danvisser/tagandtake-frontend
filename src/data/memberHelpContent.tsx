import React from "react";
import Link from "next/link";
import { Routes } from "@src/constants/routes";

export interface HelpStep {
  text: string | React.ReactNode;
}

export interface HelpSubSection {
  title: string;
  description?: string | React.ReactNode; // Optional introductory text
  steps?: HelpStep[]; // Optional step-by-step instructions
  content?: string | React.ReactNode; // Optional paragraph content
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
        title: "Creating listings",
        steps: [
          { text: "Go to a participating store with your item or items" },
          { text: "Ask a member of staff for a tag, scan the tag and follow the instructions to create your listing" },
          { text: "Your item will appear on the marketplace once listed and can be updated at any time" },
        ],
        content:
          "Tip: Add items to your available items at home to save time in store.",
      },
      {
        title: "Finding and choosing stores",
        description: "How to find participating stores and understand their requirements",
        steps: [
          { 
            text: (
              <>
                Use the{" "}
                <Link href={Routes.STORES.ROOT} className="text-primary hover:underline">
                  store finder
                </Link>
                {" "}to find stores near you
              </>
            )
          },
          { text: "Check each store's profile for: location, opening hours, available spaces" },
          { text: "Review store requirements: commission rate, minimum price, accepted categories and conditions" },
          { text: "Ensure the store accepts your item type and condition before visiting" },
        ],
      },
      {
        title: "Store requirements and rules",
        description: "Understanding store policies and display guarantees",
        steps: [
          { text: "All items must be clean before being accepted" },
          { text: "Each store sets a minimum display guarantee period - your item must remain listed during this time" },
          { text: "After the minimum guarantee period, stores can recall items" },
          { text: "Stores may also recall items that don't meet their accepted categories or conditions" },
          { text: "You have 10 days to collect recalled items before they're considered abandoned" },
        ],
      },
      {
        title: "Collecting items from store",
        description: "How to retrieve your items from a store",
        steps: [
          { text: "Go to your items page and find the item you want to collect" },
          { text: "Visit the store where your item is listed" },
          { text: "Scan the item's tag in store (while logged in) to access your collection PIN, or use the PIN that was emailed to you" },
          { text: "Provide your collection PIN to store staff" },
          { text: "The store will scan the tag and return your item" },
          { text: "Your listing will be removed from the marketplace" },
        ],
      },
      {
        title: "Item safety and liability",
        description: "Understanding responsibility for items left in store",
        steps: [
          { text: "Items are left in store at the seller's risk" },
          { text: "Stores hold no liability for damaged or stolen items" },
          { text: "Stores will do their utmost to keep items safe and well looked after" },
        ],
      },
    ],
  },
  {
    title: "Item recalls",
    subSections: [
      {
        title: "Understanding recalls",
        description: "When and why items may be recalled",
        steps: [
          { text: "After the minimum display guarantee period has passed" },
          { text: "If the item doesn't meet the store's accepted categories or conditions" },
          { text: "For other policy violations" },
          { text: "You'll receive a notification with recall details and collection deadline" },
        ],
      },
      {
        title: "Collection deadlines",
        description: "Important timelines for collecting recalled items",
        steps: [
          { text: "You have 10 days to collect recalled items from the store" },
          { text: "Items not collected within 10 days are considered abandoned" },
          { text: "Check your notifications regularly and note the collection deadline" },
        ],
      },
      {
        title: "Collecting recalled items",
        description: "How to retrieve an item that has been recalled",
        steps: [
          { text: "Check your notifications for recall details and the collection deadline" },
          { text: "Visit the store before the deadline expires" },
          { text: "Scan the item's tag in store (while logged in) to access your collection PIN, or use the PIN that was emailed to you" },
          { text: "Provide your collection PIN to store staff" },
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
        description: "Understanding your earnings and payment processing",
        steps: [
          { text: "All payments are handled by Stripe" },
          { text: "You receive: sale price minus store commission and platform transaction fees" },
          { text: "Payments are processed securely" },
        ],
      },
      {
        title: "Managing payments and withdrawals",
        description: "How to access your earnings and withdraw funds",
        steps: [
          { text: "Go to your payments page" },
          { text: "Access the Stripe dashboard to view your earnings and transaction history" },
          { text: "Add a payment card to your account" },
          { text: "Request a withdrawal of your earnings to your chosen account" },
          { text: "Funds will be transferred securely to your account" },
        ],
      },
    ],
  },
  {
    title: "Account and settings",
    subSections: [
      {
        title: "Updating your account",
        description: "How to manage your account information",
        steps: [
          { text: "Go to your settings page" },
          { text: "Update your email address, password, or profile photo as needed" },
          { text: "Save your changes" },
        ],
      },
      {
        title: "Account deletion",
        description: "How to delete your account",
        steps: [
          { text: "Go to your settings page" },
          { text: "Accounts can only be deleted if no items are currently in store" },
          { text: "If you have active or recalled listings, the delete option will be disabled until all items are collected" },
        ],
      },
    ],
  },
];
