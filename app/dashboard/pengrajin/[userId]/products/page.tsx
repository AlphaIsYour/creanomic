import ProductsContent from "@/app/dashboard/pengrajin/[userId]/products/ProductsContent";

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <ProductsContent userId={userId} />;
}
