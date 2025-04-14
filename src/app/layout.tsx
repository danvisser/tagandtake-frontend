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
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <HeaderWithAuth />
            {children}
            <SessionExpiredModal />
            <Toaster />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
