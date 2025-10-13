// app/marketplace/components/ShoppingCartIndicator.tsx (Client Component)
"use client";

import { ActionIcon, Badge } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchCartItems } from "@/lib/api/marketplace"; // Ganti dengan path fungsi fetch cart Anda

export default function ShoppingCartIndicator() {
  const { data: cartItems } = useQuery({
    queryKey: ["cartItems"],
    queryFn: fetchCartItems,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  const itemCount =
    cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <ActionIcon
      component={Link}
      href="/marketplace/cart"
      variant="subtle"
      size="lg"
      aria-label="Keranjang Belanja"
    >
      <IconShoppingCart size={24} />
      {itemCount > 0 && (
        <Badge
          size="xs"
          color="red"
          variant="filled"
          pos="absolute"
          top={5}
          right={5}
          style={{ pointerEvents: "none" }}
        >
          {itemCount}
        </Badge>
      )}
    </ActionIcon>
  );
}
