// app/marketplace/page.tsx
import { Flex, Container, Title, Text, SimpleGrid } from "@mantine/core";
import ProductCard from "@/app/marketplace/components/ProductCard";
import { fetchProducts } from "@/lib/api/marketplace";

export default async function MarketplaceHomePage() {
  // Ambil beberapa produk untuk ditampilkan di homepage
  const { data: products } = await fetchProducts({ limit: 8, sort: "newest" });

  return (
    <Container size="xl" py="lg">
      <Flex
        direction="column"
        align="center"
        justify="center"
        h={200}
        bg="blue.0"
        mb="xl"
        style={{ borderRadius: "8px" }}
      >
        <Title order={1} c="blue.8">
          Selamat Datang di Daurin Marketplace!
        </Title>
        <Text size="lg" mt="sm">
          Temukan produk kerajinan unik dan ramah lingkungan.
        </Text>
      </Flex>

      <Title order={2} mb="md">
        Produk Terbaru
      </Title>
      {products && products.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      ) : (
        <Text c="dimmed">Belum ada produk terbaru saat ini.</Text>
      )}

      {/* Bisa ditambahkan bagian lain seperti kategori populer, pengrajin unggulan, dll. */}
    </Container>
  );
}
