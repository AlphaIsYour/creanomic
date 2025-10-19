import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami - Daurin",
  description: "Hubungi tim Daurin untuk pertanyaan, bantuan, atau kerjasama",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
