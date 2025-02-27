import "./globals.css";
import Header from "@src/components/Header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <Header variant="public"/>
          {children}
      </body>
    </html>
  );
}
