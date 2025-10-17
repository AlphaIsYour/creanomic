import SalesContent from "@/app/dashboard/pengrajin/[userId]/sales/SalesContent";
export default async function SalesPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // Panggil client component
  return <SalesContent userId={userId} />;
}
