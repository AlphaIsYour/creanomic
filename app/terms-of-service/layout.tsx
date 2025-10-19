import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan - Daurin",
  description: "Syarat dan ketentuan penggunaan platform Daurin",
};

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
