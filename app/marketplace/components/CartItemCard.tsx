// app/marketplace/components/CartItemCard.tsx
"use client";

import {
  Group,
  Image,
  Text,
  ActionIcon,
  NumberInput,
  Box,
  Stack,
  Button,
} from "@mantine/core";
import { IconTrash, IconMinus, IconPlus } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItemQuantity, removeCartItem } from "@/lib/api/marketplace";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[]; // ✅ Ganti dari imageUrl jadi images (array)
    stock: number;
  };
}

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(item.quantity);

  // Mutation untuk update quantity
  const updateMutation = useMutation({
    mutationFn: (newQuantity: number) =>
      updateCartItemQuantity(item.id, newQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      notifications.show({
        title: "Berhasil",
        message: "Jumlah item diperbarui",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Gagal",
        message: "Tidak dapat memperbarui jumlah item",
        color: "red",
      });
      setQuantity(item.quantity); // Rollback
    },
  });

  // Mutation untuk hapus item
  const deleteMutation = useMutation({
    mutationFn: () => removeCartItem(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      notifications.show({
        title: "Berhasil",
        message: "Item dihapus dari keranjang",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Gagal",
        message: "Tidak dapat menghapus item",
        color: "red",
      });
    },
  });

  const handleQuantityChange = (value: number | string) => {
    const newQuantity = typeof value === "string" ? parseInt(value) : value;
    if (newQuantity >= 1 && newQuantity <= item.product.stock) {
      setQuantity(newQuantity);
      updateMutation.mutate(newQuantity);
    }
  };

  const handleIncrement = () => {
    if (quantity < item.product.stock) {
      handleQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // ✅ Ambil gambar pertama dari array, atau pakai placeholder
  const productImage = item.product.images?.[0] || "/placeholder-product.png";

  return (
    <Group align="flex-start" wrap="nowrap" p="md">
      <Image
        src={productImage}
        alt={item.product.title}
        w={100}
        h={100}
        fit="cover"
        radius="md"
        fallbackSrc="/placeholder-product.png"
      />

      <Box style={{ flex: 1 }}>
        <Stack gap="xs">
          <Text fw={600} size="lg" lineClamp={2}>
            {item.product.title}
          </Text>
          <Text size="xl" fw={700} c="blue">
            {formatPrice(item.product.price)}
          </Text>
          <Text size="sm" c="dimmed">
            Stok: {item.product.stock}
          </Text>
        </Stack>
      </Box>

      <Stack gap="sm" align="flex-end">
        <Group gap="xs">
          <ActionIcon
            variant="default"
            onClick={handleDecrement}
            disabled={quantity <= 1 || updateMutation.isPending}
          >
            <IconMinus size={16} />
          </ActionIcon>
          <NumberInput
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            max={item.product.stock}
            w={70}
            disabled={updateMutation.isPending}
            hideControls
          />
          <ActionIcon
            variant="default"
            onClick={handleIncrement}
            disabled={
              quantity >= item.product.stock || updateMutation.isPending
            }
          >
            <IconPlus size={16} />
          </ActionIcon>
        </Group>

        <Text fw={700} size="lg">
          {formatPrice(item.product.price * quantity)}
        </Text>

        <Button
          variant="subtle"
          color="red"
          size="sm"
          leftSection={<IconTrash size={16} />}
          onClick={() => deleteMutation.mutate()}
          loading={deleteMutation.isPending}
        >
          Hapus
        </Button>
      </Stack>
    </Group>
  );
}
