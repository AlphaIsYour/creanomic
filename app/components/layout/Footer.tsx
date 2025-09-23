import Link from "next/link";
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export function Footer() {
  const footerLinks = {
    platform: [
      { name: "Tentang Kami", href: "#about" },
      { name: "Cara Kerja", href: "#how-it-works" },
      { name: "Fitur", href: "#features" },
      { name: "Kontak", href: "#contact" },
    ],
    users: [
      { name: "Daftar Pengguna", href: "/auth/register" },
      { name: "Daftar Pengepul", href: "/register/pengepul" },
      { name: "Daftar Pengrajin", href: "/register/pengrajin" },
      { name: "Masuk", href: "/auth/login" },
    ],
    support: [
      { name: "Pusat Bantuan", href: "/help" },
      { name: "FAQ", href: "/faq" },
      { name: "Kebijakan Privasi", href: "/privacy" },
      { name: "Syarat & Ketentuan", href: "/terms" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-[#2C2C2C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#B7410E] to-[#D4651F] rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#B7410E] to-[#D4651F] bg-clip-text text-transparent">
                Daurin
              </span>
            </Link>

            <p className="text-gray-400 max-w-md leading-relaxed">
              Platform revolusioner yang menghubungkan masyarakat dengan
              pengepul dan pengrajin untuk menciptakan ekonomi sirkular yang
              berkelanjutan.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#B7410E]" />
                <span className="text-gray-400">info@daurin.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#B7410E]" />
                <span className="text-gray-400">+62 812 3456 7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#B7410E]" />
                <span className="text-gray-400">Surabaya, Jawa Timur</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#B7410E] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Pengguna</h3>
            <ul className="space-y-3">
              {footerLinks.users.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#B7410E] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Dukungan</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#B7410E] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Daurin. Semua hak cipta dilindungi.
            </p>

            <div className="flex space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-700 hover:bg-[#B7410E] rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
