"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@src/components/ui/button";
import { useAuthStore } from "@src/stores/authStore";
import { Routes } from "@src/constants/routes";

export default function HomePage() {
  const { isAuthenticated, role } = useAuthStore();

  const variant = React.useMemo(() => {
    if (!isAuthenticated) return "public";
    return role === "store" ? "store" : "member";
  }, [isAuthenticated, role]);

  if (variant === "member") {
    return <MemberHomePage />;
  } else if (variant === "store") {
    return <StoreHomePage />;
  } else {
    return <PublicHomePage />;
  }
}

function PublicHomePage() {
  return (
    <div className="container-fluid mx-0 px-0 py-0 flex flex-col lg:flex-row lg:items-stretch lg:min-h-screen">
      {/* Main Content */}
      <div className="lg:w-1/2 space-y-6 text-center flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <h1 className="text-3xl font-semibold md:text-4xl lg:text-4xl flex flex-col">
          <span>Sell your pre-loved clothes</span>
          <span className="mt-2">
            {" "}
            on the <span className="text-primary">high street</span>
          </span>
        </h1>
        <div className="flex flex-col gap-4 items-center">
          <Link href="/login">
            <Button variant="outline" className="w-48">
              Login
            </Button>
          </Link>
          <div className="w-full h-px bg-border mt-4 mb-4" />
          <Link href="/register/member">
            <Button className="w-48">Signup</Button>
          </Link>
        </div>
        <Link
          href="/how-it-works"
          className="text-muted-foreground underline hover:text-primary"
        >
          how it works
        </Link>
        <div className="h-2"></div>
        <p className="text-muted-foreground text-md flex flex-col items-center">
          <span>Join our community of local, circular fashion -</span>
          <span>buy and sell unwanted gems in your favorite spaces.</span>
        </p>
        <div className="h-2"></div>
        <div className="flex flex-row items-center justify-center gap-3 mt-6">
          <h2 className="text-lg font-semibold">
            Become a pre-loved host:
          </h2>
          <Link href="/register/host">
            <Button variant="outline" className="w-60">
              Register today!
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-full h-64 lg:h-screen lg:w-1/2">
        <div className="bg-blue-500 w-full h-full" />
      </div>
    </div>
  );
}

// Member variant
function MemberHomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <section className="mb-12">
        <h1 className="text-3xl font-semibold mb-6">Welcome back!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-medium mb-4">Your Wardrobe</h2>
            <p className="text-muted-foreground mb-6">
              Manage your listings and track your sales.
            </p>
            <div className="flex gap-4">
              <Link href={Routes.MEMBER.WARDROBE}>
                <Button>View Wardrobe</Button>
              </Link>
              <Link href={Routes.ITEM.NEW}>
                <Button variant="outline">Add New Item</Button>
              </Link>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-medium mb-4">Discover</h2>
            <p className="text-muted-foreground mb-6">
              Find new pre-loved items in your area.
            </p>
            <Link href="/discover">
              <Button>Browse Items</Button>
            </Link>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground text-center py-8">
              Your recent activity will appear here.
            </p>
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-medium">Ready to sell more?</h2>
              <p className="text-muted-foreground">
                List your pre-loved items in just a few clicks.
              </p>
            </div>
            <Link href={Routes.ITEM.NEW}>
              <Button size="lg">Sell Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Store variant
function StoreHomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <section className="mb-12">
        <h1 className="text-3xl font-semibold mb-6">Store Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Active Listings</h3>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Total Sales</h3>
            <p className="text-3xl font-bold">£0.00</p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Visitors</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-medium mb-4">Manage Listings</h2>
            <p className="text-muted-foreground mb-6">
              View and manage all items in your store.
            </p>
            <Link href={Routes.STORE.LISTINGS}>
              <Button>View Listings</Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-medium mb-4">Store Settings</h2>
            <p className="text-muted-foreground mb-6">
              Update your store profile and preferences.
            </p>
            <Link href={Routes.STORE.DASHBOARD}>
              <Button variant="outline">Store Settings</Button>
            </Link>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground text-center py-8">
              Your store&apos;s recent activity will appear here.
            </p>
          </div>
        </div>

        <div className="bg-primary/10 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-medium">
                Need help with your store?
              </h2>
              <p className="text-muted-foreground">
                Contact our support team for assistance.
              </p>
            </div>
            <Link href={Routes.CONTACT}>
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
