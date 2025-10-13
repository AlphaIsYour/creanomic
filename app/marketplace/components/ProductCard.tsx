// app/marketplace/components/ProductCard.tsx
import { Card, Image, Text, Badge, Group, Button } from "@mantine/core";
import Link from "next/link";
// import AddToCartButton from './AddToCartButton'; // Jika ingin AddToCartButton ada di Card (Client Component)

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    category: string;
    pengrajin: {
      user: {
        name: string;
      };
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section
        component={Link}
        href={`/marketplace/products/${product.id}`}
      >
        <Image
          src={product.images[0] || "/placeholder-image.jpg"}
          h={160}
          alt={product.title}
          fit="cover"
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={600} lineClamp={1}>
          {product.title}
        </Text>
        <Badge color="blue" variant="light">
          {product.category}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" lineClamp={2}>
        Oleh: {product.pengrajin.user.name}
      </Text>

      <Text size="lg" fw={700} mt="sm">
        Rp{product.price.toLocaleString("id-ID")}
      </Text>

      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        component={Link}
        href={`/marketplace/products/${product.id}`}
      >
        Lihat Detail
      </Button>
      {/* Jika AddToCartButton ada di sini, harus menjadi Client Component */}
      {/* <AddToCartButton productId={product.id} /> */}
    </Card>
  );
}
