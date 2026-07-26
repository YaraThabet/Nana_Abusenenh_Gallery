"use client";

import React, { useState, useEffect } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X, Globe } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "/shop", label: "SHOP" },
  { href: "/collections", label: "COLLECTION" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

const icons = [
  { Icon: Search, label: "Search" },
  { Icon: User, label: "User" },
  { Icon: Heart, label: "Wishlist" },
  { Icon: ShoppingBag, label: "Cart" },
  { Icon: Globe, label: "Language" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  return (
    <header
      className={`
        z-50 w-full items-center justify-center
        transition-all duration-300 ease-in-out
        h-14  lg:h-20
        ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white/4 backdrop-blur-sm"
        }
      `}
    >
      <div className=" w-full px-auto ">
        <div className="flex items-center justify-between px-23 pt-5 h-14 md:h-16 lg:h-20">
          <Link href="/" className="flex-shrink-0 group">
            <div className='font-["Cormorant_Garamond"] text-xl md:text-2xl lg:text-3xl font-bold text-gray-900'>
              NANA HASHIM
              <span className='block font-["Inter"] text-[7px] md:text-[8px] lg:text-[10px] uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-700 transition-colors duration-300'>
                Nana Hashim Abusenenh
              </span>
            </div>
          </Link>

          <nav className='hidden md:flex items-center space-x-1 lg:space-x-6 font-["Inter"] text-sm'>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className='
                  relative px-2 lg:px-3 py-2 text-gray-700 
                  hover:text-gray-900 transition-colors duration-300 
                  font-medium text-[10px] sm:text-xs lg:text-sm
                  after:content-[""] after:absolute after:bottom-0 after:left-1/2 
                  after:w-0 after:h-0.5 after:bg-gray-900 
                  after:transition-all after:duration-300 after:-translate-x-1/2
                  hover:after:w-full
                '
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {icons.map(({ Icon, label }, index) => (
              <button
                key={index}
                className="
                  p-1.5 md:p-2 rounded-full 
                  hover:bg-gray-100 transition-colors duration-300
                  text-gray-700 hover:text-gray-900
                "
                aria-label={label}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </button>
            ))}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-300"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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

      <div
        className={`
          md:hidden fixed inset-x-0 top-14 md:top-16 lg:top-20
          bg-white/95 backdrop-blur-md shadow-lg
          transition-all duration-300 ease-in-out
          ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <nav className='flex flex-col p-4 space-y-1 font-["Inter"] text-sm'>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className="
                px-4 py-3 rounded-lg 
                hover:bg-gray-100 transition-colors duration-200
                text-gray-700 hover:text-gray-900 font-medium
              "
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
