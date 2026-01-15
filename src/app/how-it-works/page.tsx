import Link from "next/link";
import { Routes } from "@src/constants/routes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@src/components/ui/accordion";
import { itemCategories } from "@src/data/itemReferenceData";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      {/* Marketplace-Inspired Hero Section */}
      <div className="max-w-3xl mx-auto mb-12 md:mb-16 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 leading-tight">
          Your in-store marketplace for{" "}
          <span className="border-b-4 border-primary/50">pre-loved pieces</span>
        </h1>
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
            Bring your items to a participating store, tag them with our QR
            code security tags, and place them in a designated area.
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
            2. Sell
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Your items are displayed in-store and online for shoppers to
            discover. No messaging, no shipping, just effortless selling.
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
            3. Earn
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Once your item sells, earnings are automatically split between you
            and the store - no waiting, no hassle, just simple, shared rewards.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 p-6 md:p-8 lg:p-12 rounded-lg text-center max-w-3xl mx-auto">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-normal mb-3 md:mb-4">
        Sell your items in-store today.
        </h3>
        <Link
          href={Routes.STORES.ROOT}
          className="inline-block bg-primary text-primary-foreground px-6 py-2.5 md:px-8 md:py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Find a Store Near You →
        </Link>
      </div>

      <div className="my-10"></div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-10 md:mb-16">
        <h2
          id="faq"
          className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center"
        >
          FAQs
        </h2>

        {/* Getting Started & Listing Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
          <div className="pl-4 border-l-2 border-primary/20">
            <Accordion type="single" collapsible className="w-full mb-6">
              <AccordionItem value="selling-1">
                <AccordionTrigger>How do I price my items?</AccordionTrigger>
                <AccordionContent>
                  You set your own prices when you drop off your items. Our
                  staff can help with suggestions based on condition and brand
                  if you&apos;re unsure.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="selling-2">
                <AccordionTrigger>
                  What types of items can I sell?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    Please check individual store pages for their specific
                    accepted categories. Common categories include:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {itemCategories.map((category) => (
                      <li key={category.id}>{category.name}</li>
                    ))}
                  </ul>
                  <p className="mt-2">
                    All items must be clean and ready to sell.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="selling-3">
                <AccordionTrigger>
                  Why do stores have minimum prices?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Minimum prices ensure quality standards, prevent low-value
                    items from taking up space, and make sure both sellers and
                    stores benefit from each sale.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="selling-4">
                <AccordionTrigger>
                  Do I need to create an account to sell items?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Yes, a free account is required to track your items, receive
                    payment, and get notifications about sales or recalls. You
                    can quickly create an account when dropping off your first
                    items.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Earnings & Payment Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Payments</h3>
          <div className="pl-4 border-l-2 border-primary/20">
            <Accordion type="single" collapsible className="w-full mb-6">
              <AccordionItem value="payments-1">
                <AccordionTrigger>
                  How much commission do stores take?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Commission rates vary by store, with a maximum of 50%. You
                    can find each store&apos;s commission rate on their store
                    page or when scanning their QR tags.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payments-2">
                <AccordionTrigger>
                  How quickly will I get paid after my item sells?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Payment processing typically takes 1-3 business days after
                    an item sells. You&apos;ll receive a notification when
                    payment has been processed to your account. All payments,
                    including pending ones, can be viewed and managed on your{" "}
                    <Link
                      href={Routes.MEMBER.PAYMENTS}
                      className="text-primary hover:underline"
                    >
                      Payments page
                    </Link>
                    .
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payments-3">
                <AccordionTrigger>
                  Do I need to add payment details right away?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    No, you can add your payment details later. We&apos;ll
                    safely hold any funds in your account until you&apos;re
                    ready to add your payment information. This gives you
                    flexibility while ensuring your earnings are secure.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* After Listing & Item Management */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Item Management</h3>
          <div className="pl-4 border-l-2 border-primary/20">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="management-1">
                <AccordionTrigger>
                  What happens if my item doesn&apos;t sell?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Items remain in-store for a minimum of 21 days. After this
                    period, stores may recall items to manage their inventory
                    effectively. You&apos;ll have a 10-day window post-recall to
                    collect your unsold items.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="management-2">
                <AccordionTrigger>
                  What if I don&apos;t collect my recalled items?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Items not collected within the 10-day window post-recall
                    will be considered abandoned. This fair policy prevents
                    stores from becoming storage facilities and allows them to
                    maintain quality inventory for all sellers.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="management-3">
                <AccordionTrigger>
                  What if my item gets damaged in the store?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    While stores take reasonable care of all items, they are not
                    responsible for damage that may occur during normal handling
                    or display. We recommend not listing extremely fragile or
                    irreplaceable items.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
