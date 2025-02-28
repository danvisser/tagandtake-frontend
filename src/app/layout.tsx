import "./globals.css";
import HeaderWithAuth from "@src/components/HeaderWithAuth";


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
      </body>
    </html>
  );
}
