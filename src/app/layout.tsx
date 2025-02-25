import "./globals.css";
import { Providers } from '@src/lib/Providers';
import Header from "@src/components/Header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header variant="public"/>
          {children}
        </Providers>
      </body>
    </html>
  );
}
