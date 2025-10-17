import ReviewsContent from "@/app/dashboard/pengrajin/[userId]/reviews/ReviewsContent";
export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // Panggil client component
  return <ReviewsContent userId={userId} />;
}
