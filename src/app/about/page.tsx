import Image from "next/image";
import Link from "next/link";
import { Routes } from "@src/constants/routes";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <div className="max-w-3xl mx-auto mb-12 md:mb-16 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 leading-tight">
          Our Story
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          On a mission to bring pre-loved to the high street
        </p>
      </div>

      {/* Main content with image and text side by side */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 mb-10 md:mb-16">
        {/* Image column - vertically centered on desktop */}
        <div className="w-full md:w-1/2 md:flex md:items-start">
          <div className="relative mx-auto">
            <div className="relative overflow-hidden rounded-xl shadow-xl">
              <Image
                src="/images/dan_and_mitch.webp"
                alt="Michelle and Dan, co-founders of TAG&TAKE"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <p className="text-sm text-center text-muted-foreground mt-4 italic">
              Michelle & Dan, co-founders of TAG&TAKE
            </p>
          </div>
        </div>

        {/* Text column */}
        <div className="w-full md:w-1/2 space-y-8">
          <section>
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 text-primary inline-block border-b-2 border-primary/30 pb-1">
              Driving value for the high street
            </h3>
            <p className="text-muted-foreground text-sm md:text-base">
              We&apos;re led by a conviction that finding a smart solution to
              harness the potential of second hand markets can drive value for a
              struggling high street. Tag&Take was born out of a shared drive to
              seamlessly integrated sustainable practices into everyday life. We
              knew that for any solution to work, it has to be practical and –
              most importantly – profitable!
            </p>
          </section>

          <section>
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 text-primary inline-block border-b-2 border-primary/30 pb-1">
              Keeping it circular
            </h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Our aim is simple: to empower existing retailers to seamlessly
              integrate second hand sales. It isn&apos;t just about being
              eco-friendly (though that is a plus)—it&apos;s about enabling the
              high street business model to align with a rising consumer
              appetite for pre-loved goods. We provide the tools and technology
              to make sustainable shopping accessible and attractive, ensuring
              it&apos;s a win for our partners, their customers, and the planet.
            </p>
          </section>

          <section>
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 text-primary inline-block border-b-2 border-primary/30 pb-1">
              Leading the way
            </h3>
            <p className="text-muted-foreground text-sm md:text-base">
              We truly believe that technology can help us in sharing the value
              and extending the lifecycle of products we produce, and that smart
              solutions can redefine how we value and use what we already own.
              Let&apos;s not just adapt to a new way of shopping—let&apos;s lead
              it.
            </p>
          </section>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary/5 p-6 md:p-8 lg:p-12 rounded-2xl text-center max-w-4xl mx-auto border border-primary/10 shadow-sm">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 md:mb-4">
          Want to know more?
        </h3>
        <p className="mb-5 md:mb-6 text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          Discover how our platform can benefit you.
        </p>
        <Link
          href={Routes.HOW_IT_WORKS}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
        >
          Learn how it works
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}
