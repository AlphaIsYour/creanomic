// app/marketplace/my-orders/[orderId]/page.tsx
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  List,
  Flex,
  Box,
  Image,
  Divider,
} from "@mantine/core";
import { fetchOrderById } from "@/lib/api/marketplace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <Container size="md" py="xl">
        <Title order={2} ta="center">
          Akses Ditolak
        </Title>
        <Text ta="center" mt="md">
          Anda perlu login untuk melihat detail pesanan.
        </Text>
      </Container>
    );
  }

  const order = await fetchOrderById(orderId);

  if (!order || order.userId !== session.user.id) {
    // Pastikan hanya pemilik order yang bisa melihat
    notFound();
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xs">
        Detail Pesanan #{order.orderNumber}
      </Title>
      <Badge
        color={
          order.status === "COMPLETED"
            ? "green"
            : order.status === "PENDING"
            ? "yellow"
            : order.status === "PROCESSING"
            ? "blue"
            : "red"
        }
        variant="light"
        size="lg"
      >
        {order.status.replace("_", " ")}
      </Badge>

      <Paper withBorder p="md" radius="md" mt="xl">
        <Flex gap="xl" direction={{ base: "column", sm: "row" }}>
          <Box style={{ flex: 1 }}>
            <Text size="md" fw={600} mb="xs">
              Informasi Pesanan
            </Text>
            <List spacing="xs" size="sm">
              <List.Item>
                Tanggal Pesan: {new Date(order.createdAt).toLocaleDateString()}{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </List.Item>
              <List.Item>
                Metode Pembayaran: {order.paymentMethod || "Belum dipilih"}
              </List.Item>
              {order.paidAt && (
                <List.Item>
                  Dibayar Pada: {new Date(order.paidAt).toLocaleDateString()}{" "}
                  {new Date(order.paidAt).toLocaleTimeString()}
                </List.Item>
              )}
              {order.shippedAt && (
                <List.Item>
                  Dikirim Pada: {new Date(order.shippedAt).toLocaleDateString()}{" "}
                  {new Date(order.shippedAt).toLocaleTimeString()}
                </List.Item>
              )}
              {order.completedAt && (
                <List.Item>
                  Selesai Pada:{" "}
                  {new Date(order.completedAt).toLocaleDateString()}{" "}
                  {new Date(order.completedAt).toLocaleTimeString()}
                </List.Item>
              )}
            </List>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text size="md" fw={600} mb="xs">
              Alamat Pengiriman
            </Text>
            <Text size="sm">{order.customerName}</Text>
            <Text size="sm">{order.customerPhone}</Text>
            <Text size="sm">
              {order.shippingAddress}, {order.shippingCity},{" "}
              {order.shippingProvince}
            </Text>
          </Box>
        </Flex>

        <Divider my="md" />

        <Text size="md" fw={600} mb="xs">
          Item Pesanan
        </Text>
        <Flex direction="column" gap="md">
          {order.items.map((item) => (
            <Paper key={item.id} withBorder p="sm" radius="md">
              <Group justify="space-between">
                <Group>
                  <Image
                    src={item.product.images[0] || "/placeholder-image.jpg"}
                    alt={item.product.title}
                    w={60}
                    h={60}
                    radius="sm"
                  />
                  <Box>
                    <Text
                      fw={500}
                      component={Link}
                      href={`/marketplace/products/${item.productId}`}
                    >
                      {item.product.title}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Qty: {item.quantity}
                    </Text>
                  </Box>
                </Group>
                <Text fw={600}>
                  Rp{(item.price * item.quantity).toLocaleString("id-ID")}
                </Text>
              </Group>
            </Paper>
          ))}
        </Flex>

        <Divider my="md" />

        <Group justify="space-between" mt="md">
          <Text size="md" fw={600}>
            Subtotal:
          </Text>
          <Text size="md" fw={600}>
            Rp{order.subtotal.toLocaleString("id-ID")}
          </Text>
        </Group>
        <Group justify="space-between">
          <Text size="md" fw={600}>
            Biaya Pengiriman:
          </Text>
          <Text size="md" fw={600}>
            Rp{order.shippingCost.toLocaleString("id-ID")}
          </Text>
        </Group>
        <Group justify="space-between" mt="sm">
          <Title order={3}>Total Pembayaran:</Title>
          <Title order={3} c="blue.6">
            Rp{order.totalAmount.toLocaleString("id-ID")}
          </Title>
        </Group>
      </Paper>
    </Container>
  );
}
