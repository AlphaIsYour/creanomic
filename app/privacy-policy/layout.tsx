import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi - Daurin",
  description:
    "Kebijakan privasi platform Daurin untuk pengelolaan sampah dan kerajinan daur ulang",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
