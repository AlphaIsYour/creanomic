// app/pengrajin/products/[productId]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

async function getProduct(productId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/pengrajin/products/${productId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.productId);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: `${product.title} - Bekasin`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.productId);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
