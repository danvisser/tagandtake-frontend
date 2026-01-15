"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@src/components/ui/button";
import { Routes } from "@src/constants/routes";
import { UserRole, UserRoles } from "@src/types/roles";
import Image from "next/image";
import { useAuth } from "@src/providers/AuthProvider";
import LoadingUI from "@src/components/LoadingUI";
import { ArrowRight, Store, Shirt } from "lucide-react";

type PageVariant = UserRole;

type HeroButton = {
  href: string;
  label: string;
  variant?: "default" | "outline";
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

type HeroContent = {
  title: string;
  subtitle: React.ReactNode | null;
  buttons: HeroButton[];
};

export default function HomePage() {
  const { isAuthenticated, role, isLoading } = useAuth();

  const variant = React.useMemo((): PageVariant => {
    if (!isAuthenticated) return UserRoles.GUEST;
    return role || UserRoles.GUEST;
  }, [isAuthenticated, role]);

  // Show loading state while auth is being checked
  if (isLoading) {
    return <LoadingUI />;
  }

  const heroContent: Record<PageVariant, HeroContent> = {
    [UserRoles.GUEST]: {
      title: "Your new favourite marketplace",
      subtitle: (
        <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white drop-shadow-md">
          <span className="italic font-medium">No messaging. No shipping. Just drop off and earn </span>
        </p>
      ),
      buttons: [
        { href: Routes.SIGNUP.MEMBER, label: "Start Selling" },
        { href: Routes.HOW_IT_WORKS, label: "How it works", variant: "outline" },
      ],
    },
    [UserRoles.MEMBER]: {
      title: "Clear space, clear mind",
      subtitle: (
        <>
          <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white drop-shadow-md">
            <span className="italic font-medium">Make room for what matters</span>
          </p>
        </>
      ),
      buttons: [
        { href: Routes.STORES.ROOT, label: "Find a Store Near You" },
        { href: Routes.MEMBER.ITEMS.NEW, label: "Add New Item", variant: "outline" },
      ],
    },
    [UserRoles.STORE]: {
      title: "Welcome back",
      subtitle: null,
      buttons: [
        {
          href: Routes.STORE.LISTINGS.ROOT,
          label: "Manage Listings",
          icon: <Shirt className="w-4 h-4" />
        },
        {
          href: Routes.STORE.ROOT,
          label: "View Dashboard",
          variant: "outline",
          icon: <Store className="w-4 h-4" />
        },
      ],
    },
  };

  const bottomSectionContent: Record<PageVariant, { href: string; text: string; buttonLabel: string }> = {
    [UserRoles.GUEST]: {
      href: Routes.SIGNUP.STORE,
      text: "Join the forward-thinking businesses making the most of their space - no renovations required.",
      buttonLabel: "Become a host"
    },
    [UserRoles.MEMBER]: {
      href: Routes.SIGNUP.STORE,
      text: "Join the forward-thinking businesses making the most of their space - no renovations required.",
      buttonLabel: "Become a host"
    },
    [UserRoles.STORE]: {
      href: Routes.CONTACT,
      text: "Need help?",
      buttonLabel: "Contact Support"
    },
  };

  return (
    <HomePageContent
      variant={variant}
      heroContent={heroContent[variant]}
      bottomSectionContent={bottomSectionContent[variant]}
    />
  );
}

function HomePageContent({
  variant,
  heroContent,
  bottomSectionContent,
}: {
  variant: PageVariant;
  heroContent: HeroContent;
  bottomSectionContent: { href: string; text: string; buttonLabel: string };
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection content={heroContent} />
      {variant !== UserRoles.STORE && <HowItWorksSection />}
      <BottomSection
        href={bottomSectionContent.href}
        text={bottomSectionContent.text}
        buttonLabel={bottomSectionContent.buttonLabel}
      />
    </div>
  );
}

function HeroSection({ content }: { content: HeroContent }) {
  const hasDescriptions = content.buttons.some(button => button.description);

  return (
    <section className={`relative w-full ${hasDescriptions ? 'min-h-[85vh] md:min-h-[80vh]' : 'h-[60vh] md:h-[70vh] lg:h-[80vh]'} overflow-hidden`}>
      <div className="absolute inset-0">
        <Image
          src="/images/public_home.webp"
          alt="Pre-loved clothing on the high street"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 md:px-8 py-8 md:py-12">
        <div className={`max-w-6xl ${hasDescriptions ? 'space-y-4 md:space-y-6' : 'space-y-6 md:space-y-8'}`}>
          <h1 className={`${hasDescriptions ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl'} font-bold text-white drop-shadow-lg`}>
            {content.title}
          </h1>
          {content.subtitle && <div className="space-y-2 md:space-y-3">{content.subtitle}</div>}

          {hasDescriptions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 pt-2 max-w-5xl">
              {content.buttons.map((button, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20 flex flex-col h-full"
                >
                  <p className="text-sm md:text-base text-white/90 text-left leading-relaxed flex-1">
                    {button.description}
                  </p>
                  <Link href={button.href} className="self-start mt-4">
                    <Button
                      size="lg"
                      variant={button.variant || "default"}
                      className={`text-sm md:text-base ${button.variant === "outline"
                        ? "bg-white/10 border-white/30 text-white hover:bg-white/20"
                        : ""
                        }`}
                    >
                      {button.icon && <span className="mr-2">{button.icon}</span>}
                      {button.label}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {content.buttons.map((button, index) => (
                <Link key={index} href={button.href} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant={button.variant || "default"}
                    className={`w-full sm:w-auto text-lg md:text-xl px-8 py-6 ${button.variant === "outline"
                      ? "bg-white/10 border-white/30 text-white hover:bg-white/20"
                      : ""
                      }`}
                  >
                    {button.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 leading-tight">
            Your in-store marketplace for{" "}
            <span className="border-b-4 border-primary/50">pre-loved pieces</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-10 md:mb-16">
          <ProcessStep
            icon={
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
            }
            title="1. Drop Off"
            description="Bring your items to a participating store, tag them with our QR code security tags, and place them in a designated area."
          />
          <ProcessStep
            icon={
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
            }
            title="2. Sell"
            description="Your items are displayed in-store and online for shoppers to discover. No messaging, no shipping, just effortless selling."
          />
          <ProcessStep
            icon={
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
            }
            title="3. Earn"
            description="Once your item sells, earnings are automatically split between you and the store—no waiting, no hassle, just simple, shared rewards."
          />
        </div>

        <div className="text-center flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={Routes.STORES.ROOT}>
            <Button size="lg" className="text-base md:text-lg w-full sm:w-auto">
              Find a Store Near You
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href={`${Routes.HOW_IT_WORKS}#faq`}>
            <Button variant="outline" size="lg" className="text-base md:text-lg w-full sm:w-auto">
              Learn more
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProcessStep({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg p-5 md:p-6 lg:p-8 shadow-md border-2 border-gray-200 flex flex-col items-center text-center">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground">{description}</p>
    </div>
  );
}

function BottomSection({ href, text, buttonLabel }: { href: string; text: string; buttonLabel: string }) {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-12">
          <p className="text-base md:text-lg text-muted-foreground">{text}</p>
          <Link href={href} className="block mt-4">
            <Button variant="outline" size="lg" className="text-base md:text-lg">
              {buttonLabel}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
