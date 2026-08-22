"use client";
import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

type FilterSidebarProps = {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAvailability: string | null;
  setSelectedAvailability: React.Dispatch<React.SetStateAction<string | null>>;
  minPrice: number;
  setMinPrice: React.Dispatch<React.SetStateAction<number>>;
  maxPrice: number;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
  clearAllFilters: () => void;
};

// ✅ الفئات مع ترجماتها
const CATEGORIES = [
  { en: "COOL AND ACRYLIC ON CANVAS", ar: "ألوان زيتية وأكريليك على قماش" },
  { en: "GYPSUM AND ACRYLIC ON CANVAS", ar: "جص وأكريليك على قماش" },
  { en: "ACRYLIC ON CANVAS", ar: "أكريليك على قماش" },
];

// ✅ حالات التوفر مع ترجماتها
const AVAILABILITY_STATUSES = [
  { en: "Available", ar: "متوفر" },
  { en: "Sold", ar: "مباع" },
];

export const FilterSidebar = ({
  selectedCategories,
  setSelectedCategories,
  selectedAvailability,
  setSelectedAvailability,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  clearAllFilters,
}: FilterSidebarProps) => {
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  const handleCategoryChange = (item: string) => {
    setSelectedCategories((prev) =>
      prev.includes(item)
        ? prev.filter((categories) => categories !== item)
        : [...prev, item],
    );
  };

  const handleAvailabilityChange = (status: string) => {
    setSelectedAvailability(selectedAvailability === status ? null : status);
  };

  // ✅ الحصول على النص المترجم للفئة
  const getCategoryLabel = (category: { en: string; ar: string }) => {
    return language === "ar" ? category.ar : category.en;
  };

  // ✅ الحصول على النص المترجم لحالة التوفر
  const getAvailabilityLabel = (status: { en: string; ar: string }) => {
    return language === "ar" ? status.ar : status.en;
  };

  return (
    <div
      className="w-full border-2 border-gray-200 shadow-xl rounded-2xl flex flex-col p-4 sm:p-6 bg-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full flex-1">
        {/* ✅ Category Section */}
        <div className="w-full">
          <p className="uppercase text-base sm:text-lg md:text-xl pb-3 sm:pb-4 font-medium text-gray-800">
            {t("filter.category")}
          </p>
          {CATEGORIES.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 sm:py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-1 rounded transition-colors duration-200"
            >
              <label className="text-gray-600 text-xs sm:text-sm cursor-pointer flex-1">
                {getCategoryLabel(item)}
              </label>
              <input
                type="checkbox"
                checked={selectedCategories.includes(item.en)}
                onChange={() => handleCategoryChange(item.en)}
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 accent-[#b58610] rounded border-gray-300 focus:ring-2 focus:ring-[#b58610] cursor-pointer flex-shrink-0"
              />
            </div>
          ))}
        </div>

        {/* ✅ Availability Section */}
        <div className="w-full pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200">
          <p className="uppercase text-base sm:text-lg md:text-xl pb-3 sm:pb-4 font-medium text-gray-800">
            {t("filter.availability")}
          </p>
          {AVAILABILITY_STATUSES.map((status, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 sm:py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-1 rounded transition-colors duration-200"
            >
              <label className="text-gray-600 text-xs sm:text-sm cursor-pointer flex-1">
                {getAvailabilityLabel(status)}
              </label>
              <input
                type="radio"
                name="availability"
                checked={selectedAvailability === status.en}
                onChange={() => handleAvailabilityChange(status.en)}
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 accent-[#b58610] border-gray-300 focus:ring-2 focus:ring-[#b58610] cursor-pointer flex-shrink-0"
              />
            </div>
          ))}
        </div>

        {/* ✅ Price Section */}
        <div className="w-full pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200">
          <p className="uppercase text-base sm:text-lg md:text-xl pb-3 sm:pb-4 font-medium text-gray-800">
            {t("filter.price")}
          </p>
          <div
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="relative flex-1">
              <span
                className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-gray-400 text-sm`}
              >
                ₪
              </span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                min={0}
                max={maxPrice}
                className={`w-full ${isRTL ? "pr-6 pl-2" : "pl-6 pr-2"} py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#b58610] focus:border-transparent`}
                aria-label={t("filter.minPrice")}
              />
            </div>
            <span className="text-gray-400 text-sm font-medium">
              {isRTL ? "—" : "—"}
            </span>
            <div className="relative flex-1">
              <span
                className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-gray-400 text-sm`}
              >
                ₪
              </span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                min={minPrice}
                max={15000}
                className={`w-full ${isRTL ? "pr-6 pl-2" : "pl-6 pr-2"} py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#b58610] focus:border-transparent`}
                aria-label={t("filter.maxPrice")}
              />
            </div>
          </div>
          <div
            className={`flex justify-between text-xs text-gray-500 mt-3 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span>₪{minPrice}</span>
            <span>{isRTL ? `حتى ₪${maxPrice}` : `Up to ₪${maxPrice}`}</span>
          </div>
        </div>
      </div>

      {/* ✅ Clear All Button */}
      <button
        onClick={clearAllFilters}
        className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#b58610] border-2 border-[#b58610] rounded-lg hover:bg-[#b58610] hover:text-white transition-all duration-300 uppercase tracking-wider hover:shadow-lg active:scale-95"
      >
        {t("filter.clearAll")}
      </button>
    </div>
  );
};
