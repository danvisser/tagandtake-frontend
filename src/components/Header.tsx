import Link from "next/link";
import { Button } from "@src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@src/components/ui/dropdown-menu";
import { Routes } from "@src/constants/routes";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserRole, UserRoles } from "@src/types/roles";
import { useAuth } from "@src/providers/AuthProvider";

export default function Header({ variant }: { variant: "public" | UserRole }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await logout();
    router.push(Routes.HOME);
    router.refresh();
  }, [logout, router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white dark:border-gray-800 dark:bg-gray-950 p-0 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-full items-center justify-center px-4 md:px-6 relative">
        {/* Left: Logo */}
        <Link
          href={Routes.HOME}
          className="absolute left-4 md:left-6 flex items-center gap-2"
          prefetch={false}
        >
          <span className="text-lg font-[550] tracking-[0.3em]">TAG&TAKE</span>
          <span className="sr-only">TAG&TAKE</span>
        </Link>

        {/* Center: Navigation (hidden on mobile) */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-light">
          {variant === "public" && (
            <>
              <Link href={Routes.HOME} prefetch={false}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg font-light"
                >
                  Home
                </Button>
              </Link>
              <Link href={Routes.HOW_IT_WORKS} prefetch={false}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg font-light"
                >
                  How it works
                </Button>
              </Link>
              <Link href={Routes.ABOUT} prefetch={false}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg font-light"
                >
                  About
                </Button>
              </Link>
            </>
          )}
          {variant === UserRoles.MEMBER && (
            <>
              <Link href={Routes.HOME} prefetch={false}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg font-light"
                >
                  Home
                </Button>
              </Link>
              <Link href={Routes.MEMBER.ITEMS.ROOT} prefetch={false}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg font-light"
                >
                  Wardrobe
                </Button>
              </Link>
              <Link href={Routes.MEMBER.PROFILE} prefetch={false}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg font-light"
                >
                  Profile
                </Button>
              </Link>
            </>
          )}
          {variant === UserRoles.STORE && (
            <>
              <Link href={Routes.HOME} prefetch={false}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg font-light"
                >
                  Home
                </Button>
              </Link>
              <Link href={Routes.STORE.DASHBOARD} prefetch={false}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg font-light"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href={Routes.STORE.LISTINGS.ROOT} prefetch={false}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg font-light"
                >
                  Listings
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Right: User Actions */}
        <div className="absolute right-4 md:right-6 flex items-center gap-4">
          {variant === "public" && (
            <Link href={Routes.LOGIN}>
              <Button variant="default" size="sm">
                Log in | Sign up
              </Button>
            </Link>
          )}
          {variant === UserRoles.STORE && (
            <Link href={Routes.STORE.DASHBOARD}>
              <StoreIcon className="h-6 w-6 dark:text-gray-400" />
            </Link>
          )}
          {variant === UserRoles.MEMBER && (
            <>
              <Link href={Routes.MEMBER.ITEMS.NEW}>
                <Button variant="outline" size="sm">
                  Sell now
                </Button>
              </Link>
              <Link href={Routes.MEMBER.PROFILE}>
                <ProfileIcon className="h-6 w-6 dark:text-gray-400" />
              </Link>
            </>
          )}

          {/* Mobile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-2 md:mr-0">
                <MenuIcon className="h-5 w-5 dark:text-gray-400" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {variant === "public" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={Routes.SIGNUP.MEMBER} className="w-full">
                      Sign up
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={Routes.LOGIN} className="w-full">
                      Log in
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={Routes.HOME} className="w-full">
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={Routes.HOW_IT_WORKS} className="w-full">
                      How it works
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={Routes.ABOUT} className="w-full">
                      About
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              {variant === UserRoles.MEMBER && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={Routes.MEMBER.ITEMS.ROOT} className="w-full">
                      Wardrobe
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={Routes.MEMBER.PROFILE} className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={Routes.MEMBER.SETTINGS} className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sign Out
                  </DropdownMenuItem>
                </>
              )}
              {variant === UserRoles.STORE && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={Routes.STORE.DASHBOARD} className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={Routes.STORE.LISTINGS.ROOT} className="w-full">
                      Listings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={Routes.STORE.SETTINGS} className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sign Out
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href={Routes.CONTACT} className="w-full">
                  Contact
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

/* Icons */
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
  );
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
      <path d="M3 10h18" />
      <path d="M5 10v10h14V10" />
      <path d="M9 14h6v6H9z" />
      <path d="M3 10l3-6h12l3 6" />
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
      <circle cx="12" cy="8" r="5" />
      <path d="M6 20c0-4 3-6 6-6s6 2 6 6" />
    </svg>
  );
}
