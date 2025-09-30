import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Daurin - Green Business Platform",
  description:
    "Platform bisnis hijau untuk pengelolaan sampah dan kerajinan berkelanjutan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={` antialiased`}
        style={{ fontFamily: "mona-sans" }}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
