"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@src/components/ui/button";

export default function HomePage() {
  return (
    <div className="container-fluid mx-0 px-0 py-0 lg:flex lg:items-center lg:justify-between lg:min-h-screen">
      {/* Main Content */}
      <div className="lg:w-1/2 space-y-6 text-center flex flex-col items-center justify-center lg:h-full px-4 py-12 md:py-20">
        <h1 className="text-3xl font-semibold md:text-4xl lg:text-4xl flex flex-col">
          <span>Sell your pre-loved clothes,</span>
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
        <p className="text-muted-foreground text-sm">
          Join our community of local, circular fashion - buy and sell unwanted
          gems in your favorite spaces.
        </p>
        <h2 className="text-xl font-semibold mt-6">
          Make the most of your space.
        </h2>
        <Link href="/register/host">
          <Button variant="outline" className="w-60">
            Become a pre-loved host
          </Button>
        </Link>
      </div>
      <div className="w-full h-64 lg:h-screen lg:w-1/2">
        <div className="bg-blue-500 w-full h-full" />
      </div>
    </div>
  );
}
