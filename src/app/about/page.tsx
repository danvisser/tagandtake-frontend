import Image from "next/image";
import Link from "next/link";
import { Routes } from "@src/constants/routes";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h1 className="text-3xl md:text-5xl font-semibold mb-4">Our Story</h1>
        <p className="text-lg text-muted-foreground">
          Reimagining retail for a sustainable future
        </p>
      </div>

      {/* Main content with image and text side by side */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-16">
        {/* Image column - vertically centered on desktop */}
        <div className="w-full md:w-1/2 px-4 md:px-0 md:flex md:items-center">
          <div className="relative mx-auto max-w-md md:max-w-none">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-primary opacity-50"></div>
            <Image
              src="/images/dan_and_mitch.webp"
              alt="Michelle and Dan, co-founders of TAG&TAKE"
              width={600}
              height={400}
              className="rounded-lg shadow-lg w-full h-auto relative z-10"
              priority
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-primary opacity-50"></div>
            <p className="text-sm text-center text-muted-foreground mt-4 italic">
              Michelle & Dan, co-founders of TAG&TAKE
            </p>
          </div>
        </div>

        {/* Text column */}
        <div className="w-full md:w-1/2 px-4 md:px-0 space-y-8 md:space-y-10">
          <section>
            <h3 className="text-xl md:text-2xl font-medium mb-2 text-primary">
              Driving value for the high street
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We&apos;re led by a conviction that finding a smart solution to
              harness the potential of second hand markets can drive value for a
              struggling high street. Tag&Take was born out of a shared drive to
              seamlessly integrated sustainable practices into everyday life. We
              knew that for any solution to work, it has to be practical and –
              most importantly – profitable!
            </p>
          </section>

          <section>
            <h3 className="text-xl md:text-2xl font-medium mb-2 text-primary">
              Keeping it circular
            </h3>
            <p className="text-muted-foreground leading-relaxed">
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
            <h3 className="text-xl md:text-2xl font-medium mb-2 text-primary">
              Leading the way
            </h3>
            <p className="text-muted-foreground leading-relaxed">
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
      <div className="bg-primary/10 p-6 md:p-12 rounded-lg text-center max-w-3xl mx-auto">
        <h3 className="text-xl md:text-2xl font-medium mb-3">
          Want to know more?
        </h3>
        <p className="mb-6 text-muted-foreground">
          Discover how our platform works and how it can benefit you.
        </p>
        <Link
          href={Routes.HOW_IT_WORKS}
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Learn how it works →
        </Link>
      </div>
    </div>
  );
}
