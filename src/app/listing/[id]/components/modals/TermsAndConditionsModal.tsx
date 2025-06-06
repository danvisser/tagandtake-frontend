"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { ScrollArea } from "@src/components/ui/scroll-area";

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  effectiveDate?: string;
}

export default function TermsAndConditionsModal({
  isOpen,
  onClose,
  appName = "Tag & Take",
  effectiveDate = "April 1, 2023",
}: TermsAndConditionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Listing Agreement Terms</DialogTitle>
          <DialogDescription>Effective Date: {effectiveDate}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <p>
              By listing an item on {appName}, you (&ldquo;the Seller&rdquo;)
              confirm that you have read, understood, and agreed to the
              following terms and conditions.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">1. Ownership & Accuracy</h3>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>
                    You confirm that you are the legal owner of the item and
                    have the full right to offer it for sale.
                  </li>
                  <li>
                    You confirm that all information you provide about the item
                    is accurate, complete, and not misleading.
                  </li>
                  <li>
                    You are solely responsible for ensuring your item complies
                    with all applicable laws and regulations, including any
                    restrictions on sale or display.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">2. Condition & Compliance</h3>
                <p className="mt-2">
                  Items must be clean, safe, legal, and suitable for public
                  display in a retail environment.
                </p>
                <p className="mt-2">
                  The following types of items are strictly prohibited:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Counterfeit or replica items</li>
                  <li>Stolen goods</li>
                  <li>Offensive, hazardous, or dangerous items</li>
                  <li>Items restricted by law or regulation</li>
                </ul>
                <p className="mt-2">
                  {appName} and partner stores reserve the right to reject or
                  remove any item deemed inappropriate or non-compliant.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">3. Display in Store</h3>
                <p className="mt-2">You authorise the partner store to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>
                    Temporarily hold and display your item for sale to the
                    public.
                  </li>
                  <li>
                    Move, reposition, or remove your item at its sole
                    discretion.
                  </li>
                </ul>
                <p className="mt-2">
                  The store does not act as your agent or guardian, and no
                  relationship of bailment or custodianship is created.
                </p>
                <p className="mt-2">
                  The store does not inspect items and is not responsible for
                  verifying their condition, suitability, or value.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">4. Loss, Damage & Risk</h3>
                <p className="mt-2">
                  All items are left entirely at your own risk.
                </p>
                <p className="mt-2">
                  Neither {appName} nor any partner store accepts liability for:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>
                    Theft, damage, deterioration, or misplacement of your item
                  </li>
                  <li>Any resulting loss of value or revenue</li>
                </ul>
                <p className="mt-2">
                  You are advised not to list fragile, perishable, or high-value
                  items, including items with high sentimental or monetary
                  worth.
                </p>
                <p className="mt-2">
                  By listing, you accept and acknowledge that {appName} and the
                  partner store are not liable for any loss or damage unless
                  caused by deliberate or reckless conduct.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">5. No Insurance Provided</h3>
                <p className="mt-2">
                  {appName} does not provide insurance coverage for listed
                  items.
                </p>
                <p className="mt-2">
                  Sellers are advised to obtain their own insurance for any item
                  of value or concern.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  6. Item Recall (Store Removal)
                </h3>
                <p className="mt-2">
                  The store may remove (&ldquo;recall&rdquo;) your item from the
                  sales floor at any time, including but not limited to the
                  following reasons:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>The item is damaged, unclean, or deemed inappropriate</li>
                  <li>The agreed listing period has expired</li>
                  <li>
                    The store requires the space for other items or business
                    operations
                  </li>
                </ul>
                <p className="mt-2">
                  Where possible, you will be notified of the recall.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">7. Delisting & Collection</h3>
                <p className="mt-2">
                  To delist and collect your item, you must attend the store in
                  person.
                </p>
                <p className="mt-2">
                  Remote delisting is not permitted, to ensure accurate shelf
                  management and proper handover of items.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">8. Uncollected Items</h3>
                <p className="mt-2">
                  If your item is recalled and not collected within 10 calendar
                  days, it will be considered forfeited.
                </p>
                <p className="mt-2">Forfeited items may be:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Donated to charity</li>
                  <li>Recycled</li>
                  <li>Disposed of, at the store&apos;s discretion</li>
                </ul>
                <p className="mt-2">
                  Ownership of forfeited items is considered relinquished, and
                  no payment will be made.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">9. Sales & Payment</h3>
                <p className="mt-2">
                  All sales are final. No returns, refunds, or exchanges will be
                  accepted after purchase.
                </p>
                <p className="mt-2">
                  Once your item is sold, payment will be made via Stripe to
                  your registered account, minus:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>A platform service fee charged by {appName}</li>
                  <li>A commission retained by the partner store</li>
                </ul>
                <p className="mt-2">
                  You are solely responsible for ensuring your payment and tax
                  information is accurate and up to date.
                </p>
                <p className="mt-2">
                  {appName} may delay or withhold payment if fraudulent activity
                  or breach of these terms is suspected.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">10. Legal Liability</h3>
                <p className="mt-2">
                  You agree to indemnify and hold harmless {appName} and all
                  partner stores from any claims, demands, losses, damages, or
                  legal actions arising from:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>The listing or sale of your item</li>
                  <li>Any breach of these terms</li>
                  <li>Any violations of law or third-party rights</li>
                </ul>
                <p className="mt-2">
                  {appName} acts solely as a platform provider and is not a
                  party to the transaction between you and the buyer.
                </p>
                <p className="mt-2">
                  You are responsible for any income tax, VAT, or other
                  financial obligations related to your sales.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  11. Jurisdiction & Governing Law
                </h3>
                <p className="mt-2">
                  These terms are governed by the laws of England and Wales.
                </p>
                <p className="mt-2">
                  Any disputes will be subject to the exclusive jurisdiction of
                  the courts of England and Wales.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">12. Acknowledgement</h3>
                <p className="mt-2">By listing your item, you:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>
                    Confirm that you have read, understood, and accepted these
                    terms
                  </li>
                  <li>Agree to abide by them at all times</li>
                  <li>
                    Accept the risks associated with leaving your item in-store
                    for public display and sale
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
