import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

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
        <MantineProvider>
          <Notifications position="top-right" />
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
