import Link from "next/link";
import { Routes } from "@src/constants/routes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@src/components/ui/accordion";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto mb-10 md:mb-16 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 md:mb-4">
          Your Local Marketplace for Pre-Loved Items
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Local stores, sustainable shopping, and hassle-free selling all in one
          place. Ready to join the community? Here&apos;s how it works.
        </p>
      </div>

      {/* Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-10 md:mb-16">
        {/* Step 1 */}
        <div className="bg-white rounded-lg p-5 md:p-6 lg:p-8 shadow-md border-2 border-gray-200 flex flex-col items-center text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 md:h-12 md:w-12 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
            1. Drop Off
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Bring your items to a participating store, tag them with our secure
            QR codes, and place them in a designated area. Your item instantly
            goes online.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-lg p-5 md:p-6 lg:p-8 shadow-md border-2 border-gray-200 flex flex-col items-center text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 md:h-12 md:w-12 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
            2. Shoppers Buy
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Shoppers discover your items in-store or online. No messaging, no
            shipping hassles, no meetups—the store handles everything for you.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-lg p-5 md:p-6 lg:p-8 shadow-md border-2 border-gray-200 flex flex-col items-center text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 md:h-12 md:w-12 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 7c0-5.333-8-5.333-8 0" />
              <path d="M10 7v14" />
              <path d="M6 21h12" />
              <path d="M6 13h10" />
            </svg>
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
            3. Get Paid
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Proceeds are automatically split between you and the store. No
            invoicing, no payment chasing—just simple, shared rewards for
            everyone.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-10 md:mb-16">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I price my items?</AccordionTrigger>
            <AccordionContent>
              You set your own prices when you drop off your items. Our staff
              can help with suggestions based on condition and brand if
              you&apos;re unsure.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              What happens if my item doesn&apos;t sell?
            </AccordionTrigger>
            <AccordionContent>
              Items remain in-store for 30 days. After that, you can either
              collect them or we can donate them to charity on your behalf.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>When do I get paid?</AccordionTrigger>
            <AccordionContent>
              Payment is processed automatically as soon as the sale is
              completed. Funds typically appear in your account within 1-2
              business days.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>What types of items can I sell?</AccordionTrigger>
            <AccordionContent>
              We accept clothing, accessories, shoes, and small household items
              in good condition. All items must be clean and ready to sell.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 p-6 md:p-8 lg:p-12 rounded-lg text-center max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 md:mb-4">
          Ready to turn your items into cash?
        </h2>
        <p className="mb-5 md:mb-6 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
          Start selling in minutes. Find a participating store near you and drop
          off your items today.
        </p>
        <Link
          href={Routes.STORES.ROOT}
          className="inline-block bg-primary text-primary-foreground px-6 py-2.5 md:px-8 md:py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Find a Store Near You →
        </Link>
      </div>
    </div>
  );
}
