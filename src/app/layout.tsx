import "./globals.css";
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
        <HeaderWithAuth />
        {children}
        <SessionExpiredModal />
      </body>
    </html>
  );
}
