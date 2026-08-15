"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaInstagram } from "react-icons/fa6";
import { useLanguage } from "@/app/context/LanguageContext";

const Footer = () => {
  const pathname = usePathname();
  const { language, t } = useLanguage();

  if (pathname.startsWith("/admin")) return null;

  const columns = [
    {
      title: t("footer.discover"),
      links: [
        { href: "/shop", label: t("footer.shopAll") },
        { href: "/about", label: t("footer.aboutArtist") },
      ],
    },
  ];

  return (
    <footer
      className="
        bg-[#4F3523] 
        text-[#d7d4cf] 
        w-full
        flex 
        justify-center
      "
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="
          w-full
          max-w-7xl
          px-6
          sm:px-10
          md:px-20
          py-16
        "
      >
        {/* Line - تم تحويله من الذهبي إلى البيج الفاتح */}
        <div className="w-16 h-0.5 bg-[#E5D9CA] mb-12 mx-auto sm:mx-0" />

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-10
            text-center
            sm:text-left
          "
        >
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col items-center sm:items-start">
            <span
              className="
                font-['Cormorant_Garamond']
                text-3xl
                tracking-[0.15em]
                font-light
                mb-4
                text-[#F7F3EC]
              "
            >
              {t("header.brand")}
            </span>

            <p
              className="
                text-sm
                text-[#d7d4cf]/80
                leading-relaxed
                max-w-xs
              "
            >
              {t("footer.description")}
            </p>

            <a
              href="https://instagram.com/nana.artistt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.instagramLabel")}
              className="mt-6"
            >
              <FaInstagram
                size={18}
                className="
                  text-[#d7d4cf]/80
                  hover:text-[#F7F3EC]
                  transition-colors
                "
              />
            </a>
          </div>

          {/* Links */}
          {columns.map((col) => (
            <div key={col.title}>
              <p
                className="
                  text-[#d7d4cf]/70
                  text-xs
                  uppercase
                  tracking-wider
                  mb-5
                "
              >
                {col.title}
              </p>

              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="
                        text-sm
                        text-[#d7d4cf]/90
                        hover:text-[#F7F3EC]
                        transition-colors
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="h-0.5 bg-[#d7d4cf]/20 my-12" />

        <div
          className="
            flex
            flex-col
            sm:flex-row
            justify-between
            items-center
            gap-4
            text-xs
            text-[#d7d4cf]/70
            text-center
          "
        >
          <p>
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-[#F7F3EC] transition-colors"
            >
              {t("footer.privacyPolicy")}
            </Link>

            <Link
              href="/terms"
              className="hover:text-[#F7F3EC] transition-colors"
            >
              {t("footer.termsOfSale")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;