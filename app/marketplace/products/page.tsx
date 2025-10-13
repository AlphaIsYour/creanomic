/* eslint-disable @typescript-eslint/no-unused-vars */
// app/marketplace/products/page.tsx
import { Container, Title, SimpleGrid, Flex, Box, Text } from "@mantine/core";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar"; // Client Component
import SortDropdown from "../components/SortDropdown"; // Client Component
import { fetchProducts } from "@/lib/api/marketplace";
import { Suspense } from "react";
import LoadingSpinner from "@/app/marketplace/components/LoadingSpinner";
import Pagination from "../components/Pagination";
import { MaterialType } from "@prisma/client";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // ✅ AWAIT searchParams terlebih dahulu
  const params = await searchParams;

  // Parse dan convert searchParams ke format yang sesuai dengan FetchProductsParams
  const queryParams = {
    category: params.category,
    material: params.material as MaterialType | undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    sort: params.sort as
      | "newest"
      | "cheapest"
      | "expensive"
      | "popular"
      | undefined,
    page: params.page ? parseInt(params.page, 10) : 1,
    search: params.search,
  };

  const {
    data: products,
    totalPages,
    currentPage,
  } = await fetchProducts(queryParams);

  return (
    <Container size="xl" py="lg">
      <Title order={1} mb="xl">
        Semua Produk Kerajinan
      </Title>
      <Flex gap="xl" wrap="nowrap" direction={{ base: "column", md: "row" }}>
        <Box w={{ base: "100%", md: 250 }} miw={200}>
          <Suspense fallback={<LoadingSpinner />}>
            <FilterSidebar initialParams={params} />
          </Suspense>
        </Box>
        <Box style={{ flexGrow: 1 }}>
          <Flex justify="flex-end" mb="md">
            <Suspense fallback={<LoadingSpinner />}>
              <SortDropdown initialSort={params.sort} />
            </Suspense>
          </Flex>
          {products && products.length > 0 ? (
            <>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </SimpleGrid>

              {/* Pagination Info */}
              {totalPages > 1 && (
                <Flex justify="center" mt="xl" gap="md" align="center">
                  <Text size="sm" c="dimmed">
                    Halaman {currentPage} dari {totalPages}
                  </Text>
                </Flex>
              )}

              {/* TODO: Tambahkan komponen Pagination dengan navigasi di sini */}
            </>
          ) : (
            <Box style={{ textAlign: "center", padding: "2rem" }}>
              <Text size="lg" c="dimmed">
                Tidak ada produk ditemukan dengan filter yang diberikan.
              </Text>
            </Box>
          )}
        </Box>
      </Flex>
    </Container>
  );
}
