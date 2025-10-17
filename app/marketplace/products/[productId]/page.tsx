// app/marketplace/products/[productId]/page.tsx
import {
  Container,
  Title,
  Text,
  Image,
  Group,
  Button,
  Badge,
  Flex,
  Paper,
  Divider,
  SimpleGrid,
  Box,
  Avatar,
} from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import Link from "next/link";
import { fetchProductById } from "@/lib/api/marketplace";
import AddToCartButton from "../../components/AddToCartButton"; // Client Component
import ReviewList from "@/app/marketplace/components/ReviewList"; // Client Component

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { productId } = await params;

  const product = await fetchProductById(productId);
  if (!product) {
    // Handle product not found
    return (
      <Container size="md" py="xl">
        <Title order={2} ta="center">
          Produk tidak ditemukan
        </Title>
        <Text ta="center" mt="md">
          Maaf, produk yang Anda cari tidak tersedia.
        </Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Flex gap="xl" direction={{ base: "column", md: "row" }}>
        {/* Product Images */}
        <Box style={{ flex: 1 }}>
          <Image
            src={product.images[0] || "/placeholder-image.jpg"}
            alt={product.title}
            radius="md"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          {product.images.length > 1 && (
            <SimpleGrid cols={4} spacing="xs" mt="md">
              {product.images.slice(1).map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`${product.title} ${index + 2}`}
                  radius="sm"
                  style={{ cursor: "pointer" }}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Product Info */}
        <Box style={{ flex: 1 }}>
          <Title order={1}>{product.title}</Title>
          <Text size="xl" fw={700} c="blue.6" mt="sm">
            Rp {product.price.toLocaleString("id-ID")}
          </Text>

          <Group mt="md" gap="xs">
            <Badge variant="light" color="green">
              {product.category}
            </Badge>
            <Badge variant="outline">{product.materials.join(", ")}</Badge>
          </Group>

          <Text mt="md" c="dimmed">
            {product.description}
          </Text>

          <Divider my="md" />

          <Group mt="md" gap="sm">
            <Text fw={500}>
              Stok: {product.stock > 0 ? product.stock : "Habis"}
            </Text>
          </Group>

          <Group mt="md" gap="sm">
            {product.stock > 0 && <AddToCartButton productId={product.id} />}
            <Button
              variant="default"
              leftSection={<IconMessageCircle size={18} />}
            >
              Chat Pengrajin
            </Button>
          </Group>

          <Divider my="md" />

          {/* Pengrajin Info */}
          <Text fw={500} mb="xs">
            Detail Pengrajin:
          </Text>
          <Paper withBorder p="sm" radius="md">
            <Group>
              <Avatar
                src={product.pengrajin.user.image}
                alt={product.pengrajin.user.name}
                radius="xl"
                size="md"
              />
              <Box>
                <Text fw={500}>{product.pengrajin.user.name}</Text>
                <Text size="sm" c="dimmed">
                  Total Produk: {product.pengrajin.totalProducts}
                </Text>
                {product.pengrajin.averageRating > 0 && (
                  <Text size="sm" c="dimmed">
                    Rating: {product.pengrajin.averageRating.toFixed(1)} ⭐
                  </Text>
                )}
              </Box>
            </Group>
            {/* Link ke profil pengrajin */}
            <Button
              variant="subtle"
              size="xs"
              mt="xs"
              component={Link}
              href={`/marketplace/pengrajin/${product.pengrajin.id}`}
            >
              Lihat Profil
            </Button>
          </Paper>
        </Box>
      </Flex>

      {/* Reviews Section */}
      <Divider my="xl" />
      <Title order={3} mb="md">
        Ulasan Produk ({product.reviews.length})
      </Title>
      <ReviewList productId={product.id} initialReviews={product.reviews} />
    </Container>
  );
}
