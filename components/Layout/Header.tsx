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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navLinks = [
    { href: "/shop", label: "header.shop" },
    { href: "/about", label: "header.about" },
    { href: "/contact", label: "header.contact" },
  ];

  const icons = [
    { Icon: Globe, label: "Language", type: "language" },
    { Icon: User, label: "User", type: "user" },
    { Icon: ShoppingBag, label: "Cart", type: "cart" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300 ease-in-out
          ${
            isScrolled
              ? "bg-white/90 backdrop-blur-md shadow-lg"
              : "bg-white/5 backdrop-blur-sm"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <div className='font-["Cormorant_Garamond"] text-xl md:text-2xl lg:text-3xl font-bold text-gray-900'>
                {t("header.brand")}
                <span className='block font-["Inter"] text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-700 transition-colors duration-300'>
                  {t("header.subBrand")}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="
                    relative px-3 py-2 text-sm font-medium text-gray-700
                    hover:text-gray-900 transition-colors duration-300
                    after:content-[''] after:absolute after:bottom-0 after:left-1/2
                    after:w-0 after:h-0.5 after:bg-gray-900
                    after:transition-all after:duration-300 after:-translate-x-1/2
                    hover:after:w-full
                  "
                >
                  {t(label)}
                </Link>
              ))}
            </nav>

            {/* Icons */}
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
                      p-2 rounded-full
                      hover:bg-gray-100/80
                      transition-colors duration-300
                      text-gray-600 hover:text-gray-900
                      relative group
                    "
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />

                    {isCart && totalItems > 0 && (
                      <span
                        className="
                          absolute -top-1 -right-1
                          bg-[#b58610]
                          text-white
                          text-[10px]
                          font-bold
                          w-5 h-5
                          flex items-center justify-center
                          rounded-full
                        "
                      >
                        {totalItems}
                      </span>
                    )}

                    {isLanguage && (
                      <span
                        className="
                          absolute -bottom-1 -right-1
                          bg-gray-900
                          text-white
                          text-[8px]
                          font-bold
                          w-4 h-4
                          flex items-center justify-center
                          rounded-full
                          transition-all duration-300 group-hover:scale-110
                        "
                      >
                        {language.toUpperCase()}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="
                  md:hidden p-2 rounded-full
                  hover:bg-gray-100/80
                  transition-colors duration-300
                "
                aria-label={
                  isMenuOpen ? t("common.closeMenu") : t("common.openMenu")
                }
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden absolute top-full left-0 right-0
            bg-white/95 backdrop-blur-md shadow-xl
            overflow-hidden transition-all duration-300 ease-in-out
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
                  px-4 py-3 rounded-lg
                  hover:bg-gray-100
                  transition-colors duration-200
                  text-gray-700 hover:text-gray-900
                  font-medium text-sm
                "
              >
                {t(label)}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            className="
              absolute top-0 right-0
              h-full w-full max-w-md
              bg-white shadow-2xl
              p-6 overflow-y-auto
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{t("cart.title")}</h2>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {t("cart.empty")}
              </p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex items-center gap-4
                      border-b border-gray-100 pb-4
                    "
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="
                        w-16 h-16 object-cover rounded-lg
                      "
                    />

                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>

                      <p className="text-sm text-gray-500">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="
                        text-red-500 hover:text-red-700
                        text-sm font-medium
                        transition-colors
                      "
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-lg font-semibold">
                    {t("cart.total")}: ${totalPrice.toLocaleString()}
                  </p>

                  <Link href="/checkout">
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="
                        w-full mt-4 py-3
                        bg-[#b58610]
                        text-white rounded-lg
                        hover:bg-[#a0740e]
                        transition-colors duration-300
                        font-semibold
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
