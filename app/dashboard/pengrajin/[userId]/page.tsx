// app/dashboard/pengrajin/[userId]/page.tsx
import PengrajinDashboardClient from "./PengrajinDashboardClient";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <PengrajinDashboardClient userId={userId} />;
}
