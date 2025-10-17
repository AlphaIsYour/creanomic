// app/marketplace/booking/[bookingId]/page.tsx
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
  Avatar,
  SimpleGrid,
  Button,
} from "@mantine/core";
import { fetchBookingById } from "@/lib/api/marketplace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

interface BookingDetailPageProps {
  params: { bookingId: string };
}

export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <Container size="md" py="xl">
        <Title order={2} ta="center">
          Akses Ditolak
        </Title>
        <Text ta="center" mt="md">
          Anda perlu login untuk melihat detail booking.
        </Text>
      </Container>
    );
  }

  const booking = await fetchBookingById(params.bookingId);
  // app/marketplace/booking/[bookingId]/page.tsx (Lanjutan)

  if (!booking || booking.userId !== session.user.id) {
    // Pastikan hanya pemilik booking yang bisa melihat
    notFound();
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xs">
        {booking.title}
      </Title>
      <Badge
        color={
          booking.status === "COMPLETED"
            ? "green"
            : booking.status === "PENDING"
            ? "yellow"
            : booking.status === "ACCEPTED"
            ? "blue"
            : booking.status === "REJECTED"
            ? "red"
            : "gray"
        }
        variant="light"
        size="lg"
      >
        {booking.status.replace("_", " ")}
      </Badge>

      <Paper withBorder p="md" radius="md" mt="xl">
        <Flex gap="xl" direction={{ base: "column", sm: "row" }}>
          <Box style={{ flex: 1 }}>
            <Text size="md" fw={600} mb="xs">
              Informasi Permintaan
            </Text>
            <List spacing="xs" size="sm">
              <List.Item>
                Tanggal Diajukan:{" "}
                {new Date(booking.createdAt).toLocaleDateString()}{" "}
                {new Date(booking.createdAt).toLocaleTimeString()}
              </List.Item>
              {booking.deadline && (
                <List.Item>
                  Batas Waktu: {new Date(booking.deadline).toLocaleDateString()}
                </List.Item>
              )}
              <List.Item>Jenis Layanan: {booking.serviceType}</List.Item>
              {booking.materialType && (
                <List.Item>
                  Material Diharapkan: {booking.materialType}
                </List.Item>
              )}
            </List>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text size="md" fw={600} mb="xs">
              Deskripsi & Detail
            </Text>
            <Text size="sm" c="dimmed">
              {booking.description}
            </Text>
            {booking.address && (
              <Text size="sm" mt="xs">
                Lokasi: {booking.address}
              </Text>
            )}
          </Box>
        </Flex>

        <Divider my="md" />

        <Text size="md" fw={600} mb="xs">
          Detail Harga
        </Text>
        <List spacing="xs" size="sm">
          <List.Item>
            Budget Anda: Rp{booking.budget?.toLocaleString("id-ID") || "N/A"}
          </List.Item>
          {booking.estimatedPrice && (
            <List.Item>
              Estimasi Pengrajin: Rp
              {booking.estimatedPrice.toLocaleString("id-ID")}
            </List.Item>
          )}
          {booking.finalPrice && (
            <List.Item>
              Harga Final:{" "}
              <Text span fw={700} c="blue.6">
                Rp{booking.finalPrice.toLocaleString("id-ID")}
              </Text>
            </List.Item>
          )}
        </List>

        {booking.referenceImages && booking.referenceImages.length > 0 && (
          <>
            <Divider my="md" />
            <Text size="md" fw={600} mb="xs">
              Gambar Referensi
            </Text>
            <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
              {booking.referenceImages.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Reference Image ${index + 1}`}
                  radius="sm"
                />
              ))}
            </SimpleGrid>
          </>
        )}

        {booking.pengrajin && (
          <>
            <Divider my="md" />
            <Text size="md" fw={600} mb="xs">
              Pengrajin yang Menangani
            </Text>
            <Paper withBorder p="sm" radius="md">
              <Group>
                <Avatar
                  src={booking.pengrajin.user.image}
                  alt={booking.pengrajin.user.name || "Pengrajin"}
                  radius="xl"
                />
                <Box>
                  <Text fw={500}>{booking.pengrajin.user.name}</Text>
                  <Text size="sm" c="dimmed">
                    Jenis Kerajinan: {booking.pengrajin.craftTypes.join(", ")}
                  </Text>
                </Box>
              </Group>
              <Button
                variant="subtle"
                size="xs"
                mt="xs"
                component={Link}
                href={`/marketplace/pengrajin/${booking.pengrajin.id}`}
              >
                Lihat Profil
              </Button>
              {/* Tambahkan tombol chat pengrajin (Client Component) */}
            </Paper>
          </>
        )}

        {/* TODO: Tambahkan tombol aksi berdasarkan status booking (misal: "Upload Revisi", "Konfirmasi Selesai", "Batalkan Booking") - ini akan menjadi Client Component */}
      </Paper>
    </Container>
  );
}
