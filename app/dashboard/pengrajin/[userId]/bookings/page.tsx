import BookingsContent from "@/app/dashboard/pengrajin/[userId]/bookings/BookingsContent";

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <BookingsContent userId={userId} />;
}
