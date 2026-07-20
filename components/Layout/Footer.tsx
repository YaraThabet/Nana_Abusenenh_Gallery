"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaInstagram } from "react-icons/fa6";

const columns = [
  {
    title: "Discover",
    links: [
      { href: "/shop", label: "Shop All" },
      { href: "/collections", label: "Collections" },
      { href: "/about", label: "About the Artist" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign In" },
      { href: "/register", label: "Create Account" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/cart", label: "Cart" },
    ],
  },
];

const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-black text-white justify-center items-center">
      <div className="container-gallery p-20">
        <div className="w-16 h-0.5 bg-[#b58610] mb-12" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="col-span-2">
            <span className="font-['Cormorant_Garamond'] text-3xl tracking-[0.15em] font-light block mb-4 text-white">
              NANA HASHIM
            </span>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Original paintings by Nana Hashim Abusenenh — a self-taught visual
              artist working in acrylic, gypsum and mixed media, based in
              Palestine.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/nana.artistt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nana Hashim Abusenenh on Instagram"
              >
                <FaInstagram
                  size={16}
                  strokeWidth={1.25}
                  className="text-white/50 hover:text-[#b58610] transition-colors"
                />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-5">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-[#b58610] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-0.5 bg-white/10 my-12" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} Nana Hashim Abusenenh. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-[#b58610] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#b58610] transition-colors"
            >
              Terms of Sale
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
