"use client";

import React, { useState, useEffect } from "react";
import { User, ShoppingBag, Menu, X, Globe } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";

import LoginModal from "./LoginModal";

export const Header = () => {
  const { cart, totalItems, removeFromCart } = useCart();
  const { language, toggleLanguage, t } = useLanguage();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const brown = "#65452E";

  const navLinks = [
    { href: "/", label: "header.home" },
    { href: "/shop", label: "header.shop" },
    { href: "/about", label: "header.about" },
    { href: "/contact", label: "header.contact" },
  ];

  const icons = [
    { Icon: Globe, label: "Language", type: "language" },
    { Icon: User, label: "User", type: "user" },
    { Icon: ShoppingBag, label: "Cart", type: "cart" },
  ];

  // إغلاق القائمة عند تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`
          fixed
          top-0 left-0 right-0
          z-50
          bg-white
          shadow-md
          transition-colors duration-300
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* ================= LOGO ================= */}
            <Link href="/" className="flex-shrink-0 group">
              <div
                className='
                  font-["Cormorant_Garamond"]
                  text-xl md:text-2xl lg:text-3xl
                  font-bold
                  transition-colors duration-300
                '
                style={{ color: brown }}
              >
                {t("header.brand")}

                <span
                  className='
                    block
                    font-["Inter"]
                    text-[8px] md:text-[10px]
                    text-shadow-amber-100
                    uppercase
                    tracking-[0.2em]
                    transition-colors duration-300
                  '
                  style={{ textShadow: "0 0 5px rgba(184, 155, 94, 0.5)" }}
                >
                  {t("header.subBrand")}
                </span>
              </div>
            </Link>

            {/* ================= DESKTOP NAVIGATION ================= */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="
                    relative
                    px-3 py-2
                    text-sm
                    font-medium
                    transition-colors
                    duration-300

                    text-[#3b281a]
                    hover:text-[#4F3523]

                    after:content-['']
                    after:absolute
                    after:bottom-0
                    after:left-1/2
                    after:w-0
                    after:h-[1.5px]
                    after:bg-[#3b281a]
                    after:transition-all
                    after:duration-300
                    after:-translate-x-1/2

                    hover:after:w-full
                  "
                >
                  {t(label)}
                </Link>
              ))}
            </nav>

            {/* ================= ICONS ================= */}
            <div className="flex items-center gap-1 sm:gap-2">
              {icons.map(({ Icon, type }, index) => {
                const isCart = type === "cart";
                const isUser = type === "user";
                const isLanguage = type === "language";

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isLanguage) {
                        toggleLanguage();
                      }

                      if (isCart) {
                        setIsCartOpen(true);
                      }

                      if (isUser) {
                        setIsLoginOpen(true);
                      }
                    }}
                    className="
                      p-2
                      rounded-full
                      transition-all
                      duration-300
                      relative
                      group

                      hover:bg-[#65452E]/5
                    "
                    style={{ color: brown }}
                  >
                    <Icon
                      className="
                        w-4 h-4
                        sm:w-5 sm:h-5
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                      strokeWidth={1.5}
                    />

                    {/* ================= CART COUNT ================= */}
                    {isCart && totalItems > 0 && (
                      <span
                        className="
                          absolute
                          -top-1
                          -right-1
                          w-5
                          h-5
                          flex
                          items-center
                          justify-center
                          rounded-full
                          text-[10px]
                          font-bold
                          text-white
                          bg-[#65452E]
                        "
                      >
                        {totalItems}
                      </span>
                    )}

                    {/* ================= LANGUAGE ================= */}
                    {isLanguage && (
                      <span
                        className="
                          absolute
                          -bottom-1
                          -right-1
                          w-4
                          h-4
                          flex
                          items-center
                          justify-center
                          rounded-full
                          text-[8px]
                          font-bold
                          text-white
                          bg-[#65452E]
                          transition-transform
                          duration-300
                          group-hover:scale-110
                        "
                      >
                        {language.toUpperCase()}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* ================= MOBILE MENU ================= */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="
                  md:hidden
                  p-2
                  rounded-full
                  transition-colors
                  duration-300
                  hover:bg-[#65452E]/5
                "
                style={{ color: brown }}
                aria-label={
                  isMenuOpen ? t("common.closeMenu") : t("common.openMenu")
                }
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`
            md:hidden
            absolute
            top-full
            left-0
            right-0
            bg-white
            shadow-xl
            overflow-hidden
            transition-all
            duration-300
            ease-in-out

            ${isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="
                  px-4
                  py-3
                  rounded-lg
                  transition-all
                  duration-200
                  font-medium
                  text-sm

                  text-[#65452E]
                  hover:bg-[#65452E]/5
                  hover:text-[#4F3523]
                "
              >
                {t(label)}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ================= LOGIN MODAL ================= */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* ================= CART SIDEBAR ================= */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Sidebar */}
          <div
            className="
              absolute
              top-0
              right-0
              h-full
              w-full
              max-w-md
              bg-white
              shadow-2xl
              p-6
              overflow-y-auto
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="flex justify-between items-center mb-6">
              <h2
                className="
                  text-xl
                  font-semibold
                  text-[#65452E]
                "
              >
                {t("cart.title")}
              </h2>

              <button
                onClick={() => setIsCartOpen(false)}
                className="
                  p-2
                  rounded-full
                  transition-colors
                  hover:bg-[#65452E]/5
                "
              >
                <X className="w-5 h-5" style={{ color: brown }} />
              </button>
            </div>

            {/* Empty Cart */}
            {cart.length === 0 ? (
              <p
                className="
                  text-center
                  py-8
                  text-[#80624A]
                "
              >
                {t("cart.empty")}
              </p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex
                      items-center
                      gap-4
                      border-b
                      border-[#65452E]/10
                      pb-4
                    "
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="
                        w-16
                        h-16
                        object-cover
                        rounded-lg
                      "
                    />

                    <div className="flex-1">
                      <h4 className="font-medium text-[#65452E]">
                        {item.title}
                      </h4>

                      <p className="text-sm text-[#80624A]">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="
                        text-red-500
                        hover:text-red-700
                        text-sm
                        font-medium
                        transition-colors
                      "
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                ))}

                {/* Cart Total */}
                <div
                  className="
                    pt-4
                    border-t
                    border-[#65452E]/10
                  "
                >
                  <p
                    className="
                      text-lg
                      font-semibold
                      text-[#65452E]
                    "
                  >
                    {t("cart.total")}: ${totalPrice.toLocaleString()}
                  </p>

                  <Link href="/checkout">
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="
                        w-full
                        mt-4
                        py-3
                        rounded-lg
                        text-white
                        font-semibold
                        transition-all
                        duration-300

                        bg-[#65452E]
                        hover:bg-[#4F3523]
                      "
                    >
                      {t("cart.viewCart")}
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;