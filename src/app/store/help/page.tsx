"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import { UserRoles } from "@src/types/roles";

export default function StoreHelpPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <StoreHelpContent />
    </AuthenticatedPage>
  );
}

function StoreHelpContent() {
  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="mb-4">
        <h1 className="text-3xl font-normal leading-8">Help</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Guidance for running Tag &amp; Take in your store.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick start</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>This should cover the day-to-day workflow, including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>How tagging + listing works</li>
              <li>How to handle recalls</li>
              <li>How to remove tags</li>
              <li>Common edge cases</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>Common questions and what to do:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Member says they can’t see an item</li>
              <li>Tag missing / tag error</li>
              <li>Wrong price on the tag</li>
              <li>How to delist an item</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact support</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>How to reach support, including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>What details to include when raising an issue</li>
              <li>Links to contact page / email</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}