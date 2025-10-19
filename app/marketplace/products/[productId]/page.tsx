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
import { IconMessageCircle, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { fetchProductById } from "@/lib/api/marketplace";
import AddToCartButton from "../../components/AddToCartButton"; // Client Component
import ProductTabs from "./ProductTabs"; // Client Component

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

const MATERIAL_LABELS: Record<string, string> = {
  PLASTIC: "Plastik",
  GLASS: "Kaca",
  METAL: "Logam",
  PAPER: "Kertas",
  CARDBOARD: "Kardus",
  ELECTRONIC: "Elektronik",
  TEXTILE: "Tekstil",
  WOOD: "Kayu",
  RUBBER: "Karet",
  ORGANIC: "Organik",
  OTHER: "Lainnya",
};

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
    <>
      {/* Back Button Header */}
      <Box
        bg="white"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container size="lg" py="md">
          <Button
            component={Link}
            href="/marketplace"
            variant="subtle"
            leftSection={<IconArrowLeft size={18} />}
            color="gray"
          >
            Kembali
          </Button>
        </Container>
      </Box>

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

            <Paper withBorder p="md" mt="md" mb="md">
              <Text size="xl" fw={700} c="blue.6">
                Rp {product.price.toLocaleString("id-ID")}
              </Text>
            </Paper>

            <Group mt="md" gap="xs">
              <Badge variant="light" color="green">
                {product.category}
              </Badge>
              {product.materials.map((material, idx) => (
                <Badge key={idx} variant="light" color="orange">
                  {MATERIAL_LABELS[material] || material}
                </Badge>
              ))}
            </Group>

            <Divider my="md" />

            {/* Product Details */}
            <Box>
              <Flex
                justify="space-between"
                py="xs"
                style={{ borderBottom: "1px solid #e9ecef" }}
              >
                <Text size="sm" c="dimmed">
                  Stok
                </Text>
                <Text fw={500}>
                  {product.stock > 0 ? `${product.stock} pcs` : "Habis"}
                </Text>
              </Flex>

              {product.dimensions && (
                <Flex
                  justify="space-between"
                  py="xs"
                  style={{ borderBottom: "1px solid #e9ecef" }}
                >
                  <Text size="sm" c="dimmed">
                    Dimensi
                  </Text>
                  <Text fw={500}>{product.dimensions}</Text>
                </Flex>
              )}

              {product.weight && (
                <Flex
                  justify="space-between"
                  py="xs"
                  style={{ borderBottom: "1px solid #e9ecef" }}
                >
                  <Text size="sm" c="dimmed">
                    Berat
                  </Text>
                  <Text fw={500}>{product.weight} kg</Text>
                </Flex>
              )}

              {product.colors && product.colors.length > 0 && (
                <Box py="xs" style={{ borderBottom: "1px solid #e9ecef" }}>
                  <Text size="sm" c="dimmed" mb="xs">
                    Warna
                  </Text>
                  <Group gap="xs">
                    {product.colors.map((color, idx) => (
                      <Badge key={idx} variant="light" color="gray">
                        {color}
                      </Badge>
                    ))}
                  </Group>
                </Box>
              )}

              {product.customizable && (
                <Box py="xs">
                  <Badge variant="light" color="blue" leftSection="✨">
                    Bisa Custom
                  </Badge>
                </Box>
              )}
            </Box>

            <Divider my="md" />

            <Group mt="md" gap="sm">
              {product.stock > 0 && <AddToCartButton productId={product.id} />}
              {product.pengrajin.whatsappNumber && (
                <Button
                  component="a"
                  href={`https://wa.me/${product.pengrajin.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="default"
                  leftSection={<IconMessageCircle size={18} />}
                >
                  Chat Pengrajin
                </Button>
              )}
            </Group>

            <Divider my="md" />

            {/* Pengrajin Info */}
            <Text fw={500} mb="xs">
              Detail Pengrajin:
            </Text>
            <Paper withBorder p="sm" radius="md">
              <Group>
                <Avatar
                  src={
                    product.pengrajin.user.image ||
                    "/images/photo-placeholder.svg"
                  }
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
                href={`/pengrajin/${product.pengrajin.id}`}
              >
                Lihat Profil
              </Button>
            </Paper>
          </Box>
        </Flex>

        {/* Description & Reviews Tabs - Client Component */}
        <ProductTabs
          description={product.description}
          tags={product.tags}
          productId={product.id}
          reviews={product.reviews}
        />
      </Container>
    </>
  );
}
