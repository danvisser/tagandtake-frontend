import Link from "next/link";
import { Button } from "@src/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
      <h1 className="text-5xl text-primary font-bold tracking-tight md:text-6xl">Error 404</h1>
      <h2 className="text-3xl font-semibold md:text-4xl">Page Not Found</h2>
      <p className="max-w-md text-muted-foreground ">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
