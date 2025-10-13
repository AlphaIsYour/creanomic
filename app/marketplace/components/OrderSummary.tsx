// app/marketplace/components/OrderSummary.tsx
"use client";

import { Paper, Stack, Group, Text, Divider } from "@mantine/core";

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  discount?: number;
}

export default function OrderSummary({
  subtotal,
  shippingCost,
  discount = 0,
}: OrderSummaryProps) {
  const total = subtotal + shippingCost - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Text fw={700} size="lg" mb="md">
        Ringkasan Belanja
      </Text>

      <Stack gap="sm">
        <Group justify="space-between">
          <Text c="dimmed">Subtotal</Text>
          <Text>{formatPrice(subtotal)}</Text>
        </Group>

        <Group justify="space-between">
          <Text c="dimmed">Biaya Pengiriman</Text>
          <Text>
            {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
          </Text>
        </Group>

        {discount > 0 && (
          <Group justify="space-between">
            <Text c="dimmed">Diskon</Text>
            <Text c="red">-{formatPrice(discount)}</Text>
          </Group>
        )}

        <Divider my="xs" />

        <Group justify="space-between">
          <Text fw={700} size="lg">
            Total
          </Text>
          <Text fw={700} size="xl" c="blue">
            {formatPrice(total)}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}
