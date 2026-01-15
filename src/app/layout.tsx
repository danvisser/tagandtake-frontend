"use client";

import "./globals.css";
import { AuthProvider } from "@src/providers/AuthProvider";
import HeaderWithAuth from "@src/components/HeaderWithAuth";
import { SessionExpiredModal } from "@src/components/SessionExpiredModal";
import { ErrorBoundary } from "@src/components/ErrorBoundary";
import { Toaster } from "@src/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen grid grid-rows-[auto_1fr]">
        <ErrorBoundary>
          <AuthProvider>
            <HeaderWithAuth />
            <main className="min-h-[calc(100dvh-var(--header-height))]">
              {children}
            </main>
            <SessionExpiredModal />
            <Toaster />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
