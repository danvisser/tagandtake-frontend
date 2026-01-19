"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import AuthenticatedPage from "@src/components/AuthenticatedPage";
import { UserRoles } from "@src/types/roles";

export default function StoreDashboardPage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <StoreDashboardContent />
    </AuthenticatedPage>
  );
}

function StoreDashboardContent() {
  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <div className="mb-4">
        <h1 className="text-3xl font-normal leading-8">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A simple overview of your store activity.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>At a glance</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              Keep this operational (not a big analytics suite). This section should show:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Active listings</li>
              <li>Tags available</li>
              <li>Capacity (stock limit vs active)</li>
              <li>Recalled count</li>
              <li>Sold count</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales snapshot</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>This section should show:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sold today / this week</li>
              <li>Estimated store commission earned</li>
              <li>Average sale price</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory mix</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>Keep this lightweight. This section should show:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Top categories</li>
              <li>Top conditions</li>
              <li>Average value by category (optional)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>Read-only feed of the latest events:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Latest sales</li>
              <li>Recalls</li>
              <li>Delists/abandons</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>Quick navigation buttons/links to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Listings tabs (Active / Sold / Delisted / Recalled)</li>
              <li>Marketplace settings</li>
            </ul>
            <p className="text-xs">
              Note: we don&apos;t need a separate Tasks page for now — the key “needs attention”
              counts are already represented by the badges on the listings page, and sold details
              live in the Sold tab.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
