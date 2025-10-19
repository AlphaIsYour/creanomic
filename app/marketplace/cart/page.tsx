/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/marketplace/cart/page.tsx
"use client";

import {
  Container,
  Title,
  Text,
  Button,
  Flex,
  Box,
  Paper,
  Group,
  Divider,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { fetchCartItems } from "@/lib/api/marketplace";
import CartItemCard from "@/app/marketplace/components/CartItemCard";
import OrderSummary from "@/app/marketplace/components/OrderSummary";
import WhatsAppCheckoutButton from "@/app/marketplace/components/WhatsAppCheckoutButton";
import { useRouter } from "next/navigation";
import { IconShoppingCartOff } from "@tabler/icons-react";
import LoadingOverlay from "@/app/marketplace/components/LoadingOverlay";

export default function CartPage() {
  const router = useRouter();
  const {
    data: cartItems = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      try {
        return await fetchCartItems();
      } catch (err: any) {
        if (err.message === "Unauthorized") {
          router.push("/auth/login");
          return [];
        }
        throw err;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <Container
        size="md"
        py="xl"
        style={{ position: "relative", minHeight: "300px" }}
      >
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container size="md" py="xl">
        <Title order={2} ta="center">
          Terjadi Kesalahan
        </Title>
        <Text ta="center" mt="md" c="red">
          {error?.message || "Gagal memuat keranjang belanja Anda."}
        </Text>
        <Button mt="md" onClick={() => router.push("/auth/login")}>
          Login
        </Button>
      </Container>
    );
  }

  const subtotal =
    cartItems?.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    ) || 0;

  return (
    <Container size="xl" py="lg">
      <Title order={1} mb="xl">
        Keranjang Belanja Anda
      </Title>

      {cartItems && cartItems.length > 0 ? (
        <Flex gap="xl" direction={{ base: "column", md: "row" }}>
          <Box style={{ flex: 2 }}>
            <Paper withBorder p="md" radius="md">
              <Flex direction="column" gap="md">
                {cartItems.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </Flex>
            </Paper>
          </Box>
          <Box style={{ flex: 1 }}>
            <OrderSummary subtotal={subtotal} shippingCost={0} />

            {/* WhatsApp Checkout Button */}
            <WhatsAppCheckoutButton cartItems={cartItems} subtotal={subtotal} />

            <Text size="xs" c="dimmed" ta="center" mt="sm">
              Anda akan diarahkan ke WhatsApp pengrajin untuk menyelesaikan
              pesanan
            </Text>
          </Box>
        </Flex>
      ) : (
        <Paper
          withBorder
          p="xl"
          radius="md"
          style={{
            textAlign: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconShoppingCartOff size={80} color="var(--mantine-color-gray-4)" />
          <Title order={3} mt="md">
            Keranjang Anda Kosong
          </Title>
          <Text c="dimmed" mt="xs">
            Yuk, jelajahi produk-produk menarik kami!
          </Text>
          <Button mt="lg" onClick={() => router.push("/marketplace/products")}>
            Mulai Belanja
          </Button>
        </Paper>
      )}
    </Container>
  );
}
