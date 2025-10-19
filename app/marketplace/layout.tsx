// app/marketplace/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MarketplaceLayoutClient from "./MarketplaceLayoutClient";
import QueryProvider from "@/app/providers/QueryProvider";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export default async function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <QueryProvider>
      <MantineProvider>
        <MarketplaceLayoutClient session={session}>
          {children}
        </MarketplaceLayoutClient>
      </MantineProvider>
    </QueryProvider>
  );
}
