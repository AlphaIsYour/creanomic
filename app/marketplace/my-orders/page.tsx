// app/marketplace/my-orders/page.tsx
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Button,
  Flex,
  Box,
} from "@mantine/core";
import { fetchUserOrders } from "@/lib/api/marketplace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { IconPackage } from "@tabler/icons-react";

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Handle unauthenticated user
    return (
      <Container size="md" py="xl">
        <Title order={2} ta="center">
          Akses Ditolak
        </Title>
        <Text ta="center" mt="md">
          Anda perlu login untuk melihat riwayat pesanan Anda.
        </Text>
        <Flex justify="center" mt="lg">
          <Button component={Link} href="/auth/login">
            Login
          </Button>
        </Flex>
      </Container>
    );
  }

  const orders = await fetchUserOrders(); // ← Hapus parameter session.user.id

  return (
    <Container size="xl" py="lg">
      <Title order={1} mb="xl">
        Pesanan Saya
      </Title>

      {orders && orders.length > 0 ? (
        <Flex direction="column" gap="md">
          {orders.map((order) => (
            <Paper key={order.id} withBorder p="md" radius="md">
              <Group justify="space-between" align="center">
                <Box>
                  <Text size="lg" fw={600}>
                    Order #{order.orderNumber}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Tanggal: {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                  <Text size="md" fw={500} mt="xs">
                    Total: Rp{order.totalAmount.toLocaleString("id-ID")}
                  </Text>
                </Box>
                <Group>
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
                  >
                    {order.status.replace("_", " ")}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    component={Link}
                    href={`/marketplace/my-orders/${order.id}`}
                  >
                    Lihat Detail
                  </Button>
                </Group>
              </Group>
            </Paper>
          ))}
        </Flex>
      ) : (
        <Paper withBorder p="xl" radius="md" style={{ textAlign: "center" }}>
          <IconPackage size={80} color="var(--mantine-color-gray-4)" />
          <Title order={3} mt="md">
            Anda belum memiliki pesanan.
          </Title>
          <Text c="dimmed" mt="xs">
            Mulai jelajahi produk kerajinan kami sekarang!
          </Text>
          <Button mt="lg" component={Link} href="/marketplace/products">
            Jelajahi Produk
          </Button>
        </Paper>
      )}
    </Container>
  );
}
