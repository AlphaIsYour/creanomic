// app/marketplace/layout.tsx (Server Component)
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MarketplaceLayoutClient from "./MarketplaceLayoutClient";
import QueryProvider from "@/app/providers/QueryProvider";

interface MarketplaceLayoutProps {
  children: React.ReactNode;
}

export default async function MarketplaceLayout({
  children,
}: MarketplaceLayoutProps) {
  const session = await getServerSession(authOptions);

  // Wrap dengan QueryProvider di luar MarketplaceLayoutClient
  return (
    <QueryProvider>
      <MarketplaceLayoutClient session={session}>
        {children}
      </MarketplaceLayoutClient>
    </QueryProvider>
  );
}
