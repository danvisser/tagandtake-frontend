import Link from "next/link"
import { Button } from "@src/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@src/components/ui/sheet"
import { Routes } from "../constants/routes"

export default function Header({ variant }: { variant: 'public' | 'member' | 'store'; userId?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950 p-0">
      <div className="container mx-auto flex h-16 max-w-full items-center justify-between px-0 md:px-6">
        <Link href={Routes.HOME} className="flex items-center gap-2 ml-2 md:ml-0" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="hidden items-center text-sm font-medium md:flex">
          {variant === 'public' && (
            <>
              <Link
                href={Routes.HOME}
                prefetch={false}
              >
                <Button variant="ghost" size="lg">
                  Home
                </Button>
              </Link>
              <Link
                href={Routes.HOW_IT_WORKS}
                prefetch={false}
              >
                <Button variant="ghost" size="lg">
                  How it works
                </Button>
              </Link>
              <Link
                href={Routes.ABOUT}
                prefetch={false}
              >
                <Button variant="ghost" size="lg">
                  About Us
                </Button>
              </Link>
            </>
          )}
          {variant === 'member' && (
            <>
              <Link
                href={Routes.HOME}
                prefetch={false}
              >
                <Button variant="ghost" size="lg">
                  Home
                </Button>
              </Link>
              <Link
                href={Routes.MEMBER_WARDROBE}
                prefetch={false}
              >
                <Button variant="ghost" size="lg">
                  Wardrobe
                </Button>
              </Link>
              <Link
                href={Routes.MEMBER_PROFILE}
                prefetch={false}
              >
                <Button variant="ghost" size="lg">
                  Profile
                </Button>
              </Link>
            </>
          )}
          {variant === 'store' && (
            <>
              <Link
                href={Routes.HOME}
                prefetch={false}
              >
                <Button variant="ghost" size="lg">
                  Home
                </Button>
              </Link>
              <Link
                href={Routes.STORE_DASHBOARD}
                prefetch={false}
              >
                <Button variant="ghost" size="lg">
                  Dashboard
                </Button>
              </Link>
              <Link
                href={Routes.STORE_LISTINGS}
                prefetch={false}
              >
                <Button variant="ghost" size="lg">
                  Listings
                </Button>
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {variant === 'public' && (
            <Link href={Routes.LOGIN}>
              <Button variant="default" size="sm">
                Log in | Sign up
              </Button>
            </Link>
          )}
          {variant === 'store' && (
            <Link href={Routes.STORE_DASHBOARD}>
              <StoreIcon className="h-6 w-6 dark:text-gray-400" />
            </Link>
          )}
          {variant === 'member' && (
            <Link href={Routes.MEMBER_PROFILE}>
              <ProfileIcon className="h-6 w-6 dark:text-gray-400" />
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild> 
              <Button variant="ghost" size="sm" className="mr-2 md:mr-0">
                <MenuIcon className="h-5 w-5 dark:text-gray-400" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4">
              <SheetTitle></SheetTitle>
              <div className="grid gap-4 p-4">
                {variant === 'public' && (
                  <>
                    <Link
                      href={Routes.HOME}
                      className=" hover:text-primary/50 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      Home
                    </Link>
                    <Link
                      href={Routes.HOW_IT_WORKS}
                      className=" hover:text-primary/50 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      How it works
                    </Link>
                    <Link
                      href={Routes.ABOUT}
                      className=" hover:text-primary/50 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      About Us
                    </Link>
                  </>
                )}
                {variant === 'member' && (
                  <>
                    <Link
                      href={Routes.MEMBER_WARDROBE}
                      className=" hover:text-primary/50 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      Wardrobe
                    </Link>
                    <Link
                      href={Routes.MEMBER_PROFILE}
                      className=" hover:text-primary/50 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      Profile
                    </Link>
                  </>
                )}
                {variant === 'store' && (
                  <>
                    <Link
                      href={Routes.STORE_DASHBOARD}
                      className=" hover:text-primary/50 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href={Routes.STORE_LISTINGS}
                      className=" hover:text-primary/50 dark:text-gray-400 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      Listings
                    </Link>
                  </>
                )}
                <Link
                  href={Routes.CONTACT}
                  className=" hover:text-primary/50 dark:text-gray-400 dark:hover:text-gray-50"
                  prefetch={false}
                >
                  Contact
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="2" x2="22" y1="4" y2="4" />
      <line x1="2" x2="22" y1="20" y2="20" />
    </svg>
  )
}


function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}


function StoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10h18" /> {/* Awning */}
      <path d="M5 10v10h14V10" /> {/* Storefront */}
      <path d="M9 14h6v6H9z" /> {/* Door */}
      <path d="M3 10l3-6h12l3 6" /> {/* Roof */}
    </svg>
  );
}

function ProfileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="5" /> {/* Head */}
      <path d="M6 20c0-4 3-6 6-6s6 2 6 6" /> {/* Shoulders */}
    </svg>
  );
}
