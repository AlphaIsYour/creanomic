// app/marketplace/booking/page.tsx
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
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { IconTool } from "@tabler/icons-react";

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <Container size="md" py="xl">
        <Title order={2} ta="center">
          Akses Ditolak
        </Title>
        <Text ta="center" mt="md">
          Anda perlu login untuk melihat riwayat booking Anda.
        </Text>
        <Flex justify="center" mt="lg">
          <Button component={Link} href="/auth/login">
            Login
          </Button>
        </Flex>
      </Container>
    );
  }

  // Akses database langsung
  const bookings = await prisma.serviceBooking.findMany({
    where: { userId: session.user.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      pengrajin: {
        select: {
          id: true,
          craftTypes: true,
          user: { select: { id: true, name: true, image: true, email: true } },
        },
      },
      transactions: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Container size="xl" py="lg">
      <Title order={1} mb="xl">
        Booking Layanan Saya
      </Title>

      {bookings && bookings.length > 0 ? (
        <Flex direction="column" gap="md">
          {bookings.map((booking) => (
            <Paper key={booking.id} withBorder p="md" radius="md">
              <Group justify="space-between" align="center">
                <Box>
                  <Text size="lg" fw={600}>
                    {booking.title}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Tanggal: {new Date(booking.createdAt).toLocaleDateString()}
                  </Text>
                  {booking.pengrajin && (
                    <Text size="sm">
                      Pengrajin: {booking.pengrajin.user.name}
                    </Text>
                  )}
                </Box>
                <Group>
                  <Badge
                    color={
                      booking.status === "COMPLETED"
                        ? "green"
                        : booking.status === "PENDING"
                        ? "yellow"
                        : booking.status === "ACCEPTED"
                        ? "blue"
                        : "red"
                    }
                    variant="light"
                  >
                    {booking.status.replace("_", " ")}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    component={Link}
                    href={`/marketplace/booking/${booking.id}`}
                  >
                    Lihat Detail
                  </Button>
                </Group>
              </Group>
            </Paper>
          ))}
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
          <IconTool size={80} color="var(--mantine-color-gray-4)" />
          <Title order={3} mt="md">
            Anda belum membuat permintaan booking layanan.
          </Title>
          <Text c="dimmed" mt="xs">
            Butuh kerajinan khusus? Ajukan permintaan sekarang!
          </Text>
          <Button mt="lg" component={Link} href="/marketplace/booking/new">
            Buat Booking Baru
          </Button>
        </Paper>
      )}
    </Container>
  );
}
