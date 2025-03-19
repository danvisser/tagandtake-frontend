"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@src/components/ui/button";
import { Routes } from "@src/constants/routes";
import { UserRole, UserRoles } from "@src/types/roles";
import Image from "next/image";
import { useAuth } from "@src/providers/AuthProvider";
import LoadingUI from "@src/components/LoadingUI";

type PageVariant = "public" | UserRole;

export default function HomePage() {
  const { isAuthenticated, role, isLoading } = useAuth();

  const variant = React.useMemo((): PageVariant => {
    if (!isAuthenticated) return "public";
    return role || "public";
  }, [isAuthenticated, role]);

  // Show loading state while auth is being checked
  if (isLoading) {
    return <LoadingUI />;
  }

  if (variant === UserRoles.MEMBER) {
    return <MemberHomePage />;
  } else if (variant === UserRoles.STORE) {
    return <StoreHomePage />;
  } else {
    return <PublicHomePage />;
  }
}

function PublicHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Image section - full width on mobile, half width on desktop */}
      <div className="w-full h-64 md:h-80 lg:h-screen lg:w-1/2 lg:fixed lg:right-0">
        <div className="relative w-full h-full">
          <Image
            src="/images/public_home.webp"
            alt="Pre-loved clothing on the high street"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content section - full width on mobile, half width and centered on desktop */}
      <div className="w-full lg:w-1/2 space-y-6 text-center flex flex-col items-center justify-center px-4 py-8 md:py-12 lg:min-h-screen">
        <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl flex flex-col mt-4 lg:mt-0">
          <span className="mb-2">Clear space, clear mind</span>
          <span className="text-lg font-medium md:text-xl lg:text-2xl text-muted-foreground">
            Sell your pre-loved clothes on the high street
          </span>
        </h1>

        <div className="flex flex-col gap-4 items-center w-full max-w-xs">
          <Link href={Routes.LOGIN} className="w-full">
            <Button variant="outline" className="w-full">
              Login
            </Button>
          </Link>
          <div className="w-full h-px bg-border my-2" />
          <Link href={Routes.SIGNUP.MEMBER} className="w-full">
            <Button className="w-full">Signup</Button>
          </Link>
        </div>

        <Link
          href={Routes.HOW_IT_WORKS}
          className="text-muted-foreground underline hover:text-primary text-sm md:text-base"
        >
          how it works
        </Link>

        <p className="text-muted-foreground text-sm md:text-base flex flex-col items-center">
          <span>Join our community of local, circular fashion -</span>
          <span>buy and sell unwanted gems in your favorite spaces.</span>
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4 w-full max-w-xs md:max-w-md">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-0">
            Become a pre-loved host:
          </h2>
          <Link href={Routes.SIGNUP.STORE} className="w-full md:w-auto">
            <Button variant="outline" className="w-full md:w-auto">
              Register today!
            </Button>
          </Link>
        </div>
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
              <Link href={Routes.MEMBER.ITEMS.ROOT}>
                <Button>View Wardrobe</Button>
              </Link>
              <Link href={Routes.MEMBER.ITEMS.NEW}>
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
            <Link href={Routes.MEMBER.ITEMS.NEW}>
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
            <Link href={Routes.STORE.LISTINGS.ROOT}>
              <Button>View Listings</Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-medium mb-4">Store Settings</h2>
            <p className="text-muted-foreground mb-6">
              Update your store profile and preferences.
            </p>
            <Link href={Routes.STORE.SETTINGS}>
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
