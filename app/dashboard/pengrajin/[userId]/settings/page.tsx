import SettingsContent from "@/app/dashboard/pengrajin/[userId]/settings/SettingsContent";
export default async function SettingsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // Panggil client component
  return <SettingsContent userId={userId} />;
}
