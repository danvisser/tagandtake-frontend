import "./globals.css";
import { AuthProvider } from "@src/providers/AuthProvider";
import HeaderWithAuth from "@src/components/HeaderWithAuth";
import { SessionExpiredModal } from "@src/components/SessionExpiredModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <HeaderWithAuth />
          {children}
          <SessionExpiredModal />
        </AuthProvider>
      </body>
    </html>
  );
}
