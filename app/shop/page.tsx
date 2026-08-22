"use client";

import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { FilterSidebar } from "@/components/Shop/FilterSidebar";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

type Artwork = {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  medium: string;
  medium_ar?: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  is_available: boolean;
  is_sold: boolean;
};

// ✅ دالة مساعدة للحصول على النص المترجم
const getLocalizedText = (
  artwork: Artwork,
  field: "title" | "description" | "medium",
  language: "en" | "ar",
): string => {
  if (language === "ar") {
    const arField = `${field}_ar` as keyof Artwork;
    return (artwork[arField] as string) || artwork[field];
  }
  return artwork[field];
};

const Page = () => {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<
    string | null
  >(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("artworks").select("*");

        if (error) throw error;

        setArtworks(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching artworks:", error.message);
        } else {
          console.error("Unknown error occurred:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  // ✅ فلترة اللوحات
  const filterArtworks = artworks.filter((artwork) => {
    const title = getLocalizedText(artwork, "title", language);
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(artwork.medium);
    let matchesAvailability = true;
    if (selectedAvailability === t("shop.available")) {
      matchesAvailability = artwork.is_available && !artwork.is_sold;
    } else if (selectedAvailability === t("shop.sold")) {
      matchesAvailability = artwork.is_sold;
    }
    const matchesPrice = artwork.price >= minPrice && artwork.price <= maxPrice;

    return (
      matchesSearch && matchesCategory && matchesAvailability && matchesPrice
    );
  });

  // ✅ حساب عدد الصفحات
  const totalPages = Math.ceil(filterArtworks.length / itemsPerPage);

  // ✅ الحصول على اللوحات في الصفحة الحالية
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArtworks = filterArtworks.slice(startIndex, endIndex);

  // ✅ تغيير الصفحة
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ✅ إعادة تعيين الصفحة عند تغيير الفلاتر
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategories, selectedAvailability, minPrice, maxPrice]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedAvailability(null);
    setMinPrice(0);
    setMaxPrice(15000);
    setCurrentPage(1);
  };

  // ✅ إنشاء أرقام الصفحات
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      }

      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className="w-full min-h-screen bg-[#F7F3EC] px-4 sm:px-8 lg:px-23 pt-10 md:pt-24 lg:pt-28 flex flex-col"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* ✅ العنوان والبحث */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <div className="text-center sm:text-left">
          <p className="uppercase text-[#b58610] text-xs sm:text-sm tracking-widest font-medium">
            {t("shop.badge")}
          </p>
          <h1 className='uppercase font-bold font-["Cormorant_Garamond"] text-xl sm:text-3xl md:text-3xl text-[#4F3523]'>
            {t("shop.title")}
          </h1>
        </div>

        {/* ✅ شريط البحث */}
        <div className="flex flex-row w-full sm:w-80 h-12 rounded-full border-2 border-[#E5D9CA] bg-white/90 backdrop-blur-sm items-center hover:border-[#b58610] focus-within:border-[#b58610] focus-within:shadow-lg transition-all duration-300">
          <Search className="text-[#4F3523]/60 ml-4 mr-2 w-5 h-5 transition-colors duration-300 group-focus-within:text-[#b58610]" />
          <input
            type="search"
            placeholder={t("shop.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full outline-none bg-transparent text-sm pr-4 text-[#4F3523] placeholder:text-[#4F3523]/50"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mr-3 text-[#4F3523]/60 hover:text-[#4F3523] transition-colors duration-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ✅ المحتوى الرئيسي */}
      <div className="w-full flex-1 pt-8 pb-5 flex flex-col md:flex-row gap-6">
        {/* ✅ زر الفلتر في الجوال */}
        <div className="md:hidden flex justify-between items-center mb-2">
          <button
            onClick={() => setOpenFilter(true)}
            className="px-5 py-3 border-2 border-[#b58610] text-[#b58610] bg-white rounded-lg uppercase text-sm font-medium hover:bg-[#b58610] hover:text-white transition-colors duration-300"
          >
            <SlidersHorizontal className="w-4 h-4 inline mr-2" />
            {t("shop.filters")}
          </button>
          <span className="text-sm text-[#4F3523]/70">
            {filterArtworks.length} {t("shop.results")}
          </span>
        </div>

        {/* ✅ الفلتر الجانبي (ديسكتوب) */}
        <div className="hidden md:flex md:w-1/4">
          <FilterSidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedAvailability={selectedAvailability}
            setSelectedAvailability={setSelectedAvailability}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            clearAllFilters={clearAllFilters}
          />
        </div>

        {/* ✅ الفلتر المنبثق (جوال) */}
        {openFilter && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              onClick={() => setOpenFilter(false)}
              className="absolute inset-0 bg-[#4F3523]/70 backdrop-blur-sm"
            />

            <div
              className="
                absolute
                left-0
                top-0
                h-full
                w-[85%]
                max-w-sm
                bg-[#F7F3EC]
                shadow-2xl
                p-5
                overflow-y-auto
              "
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold text-[#4F3523]">
                  {t("shop.filters")}
                </h2>
                <button
                  onClick={() => setOpenFilter(false)}
                  className="p-2 rounded-full hover:bg-[#E5D9CA] transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-[#4F3523]" />
                </button>
              </div>

              <FilterSidebar
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedAvailability={selectedAvailability}
                setSelectedAvailability={setSelectedAvailability}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                clearAllFilters={clearAllFilters}
              />

              <button
                onClick={() => setOpenFilter(false)}
                className="w-full mt-6 py-3 text-sm font-medium text-white bg-[#b58610] rounded-lg hover:bg-[#a0740e] transition-colors duration-300 uppercase tracking-wider"
              >
                {t("shop.applyFilters")}
              </button>
            </div>
          </div>
        )}

        {/* ✅ عرض اللوحات */}
        <div className="flex-1 bg-white border border-[#E5D9CA] shadow-lg rounded-2xl p-6 min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="w-16 h-16 border-4 border-[#E5D9CA] border-t-[#b58610] rounded-full animate-spin"></div>
              <p className="mt-4 text-[#4F3523]/70 text-sm">
                {t("shop.loading")}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentArtworks.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 rounded-full bg-[#F7F3EC] flex items-center justify-center mb-6">
                      <Search className="w-10 h-10 text-[#4F3523]/30" />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#4F3523] mb-2">
                      {t("shop.noResults")}
                    </h3>
                    <p className="text-[#4F3523]/70 max-w-sm">
                      {search
                        ? t("shop.noResultsSearch").replace("{search}", search)
                        : t("shop.startTyping")}
                    </p>
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="mt-6 px-6 py-2 text-sm font-medium text-[#b58610] border-2 border-[#b58610] rounded-full hover:bg-[#b58610] hover:text-white transition-all duration-300"
                      >
                        {t("shop.clearSearch")}
                      </button>
                    )}
                  </div>
                ) : (
                  currentArtworks.map((artwork) => {
                    const title = getLocalizedText(artwork, "title", language);
                    const description = getLocalizedText(
                      artwork,
                      "description",
                      language,
                    );
                    const medium = getLocalizedText(
                      artwork,
                      "medium",
                      language,
                    );

                    return (
                      <Link
                        href={`/shop/${artwork.id}`}
                        key={artwork.id}
                        className="group border border-[#E5D9CA] bg-[#F7F3EC] rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#b58610] transition-all duration-300"
                      >
                        <div className="w-full h-64 overflow-hidden bg-[#E5D9CA]">
                          <img
                            src={artwork.image_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4">
                          <h2 className='font-["Cormorant_Garamond"] text-xl font-bold text-[#4F3523] line-clamp-1'>
                            {title}
                          </h2>
                          <p className="text-sm text-[#4F3523]/70 mt-2 line-clamp-2">
                            {description}
                          </p>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              {/* السعر الأساسي (مع خصم) */}
                              <span className="text-[#b58610] font-semibold text-lg">
                                {artwork.discount_price
                                  ? `₪${artwork.discount_price.toLocaleString()}`
                                  : `₪${artwork.price.toLocaleString()}`}
                              </span>

                              {/* سعر مشطوب (السعر الأصلي إذا كان هناك خصم) */}
                              {artwork.discount_price && (
                                <span className="text-sm text-[#4F3523]/50 line-through">
                                  ₪{artwork.price.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* حالة المنتج (بقية الكود كما هو) */}
                            {artwork.is_sold ? (
                              <span className="text-red-500 text-sm font-medium">
                                {t("shop.sold")}
                              </span>
                            ) : artwork.is_available ? (
                              <span className="text-[#4F3523] bg-[#E5D9CA] px-3 py-0.5 rounded-full text-xs font-medium">
                                {t("shop.available")}
                              </span>
                            ) : (
                              <span className="text-[#4F3523]/60 text-sm font-medium">
                                {t("shop.reserved")}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#4F3523]/60 mt-2 line-clamp-1">
                            {medium}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              {/* ✅ Pagination - تم تحديث الألوان */}
              {filterArtworks.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-[#E5D9CA]">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      currentPage === 1
                        ? "text-[#E5D9CA] cursor-not-allowed"
                        : "text-[#4F3523] hover:bg-[#F7F3EC] hover:text-[#b58610]"
                    }`}
                    aria-label={
                      language === "ar" ? "الصفحة السابقة" : "Previous page"
                    }
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === "number" && goToPage(page)}
                      className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        page === currentPage
                          ? "bg-[#b58610] text-white shadow-md"
                          : page === "..."
                            ? "text-[#4F3523]/40 cursor-default"
                            : "text-[#4F3523] hover:bg-[#F7F3EC] hover:text-[#b58610]"
                      }`}
                      disabled={page === "..."}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      currentPage === totalPages
                        ? "text-[#E5D9CA] cursor-not-allowed"
                        : "text-[#4F3523] hover:bg-[#F7F3EC] hover:text-[#b58610]"
                    }`}
                    aria-label={
                      language === "ar" ? "الصفحة التالية" : "Next page"
                    }
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* ✅ عرض عدد النتائج */}
              {filterArtworks.length > 0 && (
                <div className="text-center text-sm text-[#4F3523]/50 mt-4">
                  {language === "ar"
                    ? `عرض ${startIndex + 1} - ${Math.min(endIndex, filterArtworks.length)} من ${filterArtworks.length} ${filterArtworks.length === 1 ? "نتيجة" : "نتائج"}`
                    : `Showing ${startIndex + 1} - ${Math.min(endIndex, filterArtworks.length)} of ${filterArtworks.length} results`}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
