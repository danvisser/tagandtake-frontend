"use client";

import RedirectIfAuthenticated from "@src/components/RedirectIfAuthenticated";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>;
}
