// app/marketplace/MarketplaceLayoutClient.tsx
"use client";

import { AppShell, Container, Group, Text } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import UserMenu from "@/app/marketplace/components/UserMenu";
import ThemeToggle from "@/app/marketplace/components/ThemeToggle";
import ShoppingCartIndicator from "./components/ShoppingCartIndicator";

interface MarketplaceLayoutClientProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function MarketplaceLayoutClient({
  children,
  session,
}: MarketplaceLayoutClientProps) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Link
                href="/marketplace"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  src="/logo.svg"
                  alt="Creanomic Logo"
                  width={30}
                  height={30}
                  priority
                />
                <Text fw={700} size="xl" ml="xs">
                  Creanomic
                </Text>
              </Link>
              <Group ml="xl" gap="md" visibleFrom="sm">
                <Link
                  href="/marketplace/products"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Produk
                </Link>
                <Link
                  href="/marketplace/booking"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Layanan Custom
                </Link>
                <Link
                  href="/marketplace/my-orders"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Pesanan Saya
                </Link>
              </Group>
            </Group>

            <Group>
              <ShoppingCartIndicator />
              <ThemeToggle />
              <UserMenu session={session} />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer p="md" style={{ textAlign: "center" }}>
        <Container size="xl">
          <Text size="sm" c="dimmed">
            &copy; {new Date().getFullYear()} Creanomic. All rights reserved.
          </Text>
          <Group justify="center" gap="md" mt="xs">
            <Link
              href="/privacy-policy"
              style={{
                textDecoration: "none",
                color: "inherit",
                fontSize: "14px",
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              style={{
                textDecoration: "none",
                color: "inherit",
                fontSize: "14px",
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              style={{
                textDecoration: "none",
                color: "inherit",
                fontSize: "14px",
              }}
            >
              Contact Us
            </Link>
          </Group>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}
