/* eslint-disable @typescript-eslint/no-explicit-any */
// app/marketplace/products/[productId]/ProductTabs.tsx
"use client";

import { useState } from "react";
import { Paper, Tabs, Title, Text, Group, Badge } from "@mantine/core";
import ReviewList from "@/app/marketplace/components/ReviewList";

interface ProductTabsProps {
  description: string;
  tags?: string[];
  productId: string;
  reviews: any[];
}

export default function ProductTabs({
  description,
  tags,
  productId,
  reviews,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<string | null>("description");

  return (
    <Paper withBorder p="xl" mt="xl" radius="md">
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="description">
            <Text fw={500}>Deskripsi Produk</Text>
          </Tabs.Tab>
          <Tabs.Tab value="reviews">
            <Text fw={500}>Ulasan ({reviews.length})</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="description" pt="xl">
          <Title order={2} mb="md">
            Deskripsi Produk
          </Title>
          <Text style={{ whiteSpace: "pre-wrap" }} mb="lg">
            {description}
          </Text>

          {tags && tags.length > 0 && (
            <>
              <Title order={3} size="h4" mb="sm">
                Tags
              </Title>
              <Group gap="xs">
                {tags.map((tag, idx) => (
                  <Badge key={idx} variant="light" color="gray" size="lg">
                    #{tag}
                  </Badge>
                ))}
              </Group>
            </>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="reviews" pt="xl">
          <Title order={2} mb="md">
            Ulasan Produk ({reviews.length})
          </Title>
          <ReviewList productId={productId} initialReviews={reviews} />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}
