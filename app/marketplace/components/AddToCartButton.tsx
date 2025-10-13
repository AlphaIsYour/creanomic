// app/marketplace/components/AddToCartButton.tsx
"use client";

import { Button, NumberInput, Group } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/lib/api/marketplace"; // Fungsi API untuk menambah ke keranjang
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IconShoppingCart } from "@tabler/icons-react";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState<number>(1);

  const mutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => addToCart(productId, quantity),
    onSuccess: () => {
      notifications.show({
        title: "Berhasil!",
        message: "Produk ditambahkan ke keranjang.",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["cartItems"] }); // Invalidate cart query to refetch
    },
    onError: (error) => {
      notifications.show({
        title: "Gagal",
        message: error.message || "Gagal menambahkan produk ke keranjang.",
        color: "red",
      });
    },
  });

  const handleAddToCart = () => {
    mutation.mutate({ productId, quantity });
  };

  return (
    <Group wrap="nowrap" grow>
      <NumberInput
        min={1}
        value={quantity}
        onChange={(val) => setQuantity(typeof val === "number" ? val : 1)}
        allowDecimal={false}
        w={100}
      />
      <Button
        leftSection={<IconShoppingCart size={18} />}
        onClick={handleAddToCart}
        loading={mutation.isPending}
        disabled={mutation.isPending}
      >
        Tambah ke Keranjang
      </Button>
    </Group>
  );
}
