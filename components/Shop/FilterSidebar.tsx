"use client";
import { useState } from "react";

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

const CATEGORIES = [
  "COOL AND ACRYLIC ON CANVAS",
  "GYPSUM AND ACRYLIC ON CANVAS",
  "ACRYLIC ON CANVAS",
];

export  const FilterSidebar = ({
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
  const handleCategoryChange = (item: string) => {
    setSelectedCategories((prev) =>
      prev.includes(item)
        ? prev.filter((categories) => categories !== item)
        : [...prev, item]
    );
  };

  const handleAvailabilityChange = (status: string) => {
    setSelectedAvailability(selectedAvailability === status ? null : status);
  };

  return (
    <div className="w-full border-2 border-gray-200 shadow-xl rounded-2xl flex flex-col p-6 bg-white">
      <div className="w-full flex-1">
        {/* Category */}
        <div className="w-full">
          <p className="uppercase text-xl pb-4 font-medium">Category</p>
          {CATEGORIES.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <label className="text-gray-600 text-sm">{item}</label>
              <input
                type="checkbox"
                checked={selectedCategories.includes(item)}
                onChange={() => handleCategoryChange(item)}
                className="w-4 h-4 accent-[#b58610] rounded border-gray-300 focus:ring-2 focus:ring-[#b58610]"
              />
            </div>
          ))}
        </div>

        {/* Availability */}
        <div className="w-full pt-6 mt-4 border-t border-gray-200">
          <p className="uppercase text-xl pb-4 font-medium">Availability</p>
          {["Available", "Sold"].map((status, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <label className="text-gray-600 text-sm">{status}</label>
              <input
                type="radio"
                name="availability"
                checked={selectedAvailability === status}
                onChange={() => handleAvailabilityChange(status)}
                className="w-4 h-4 accent-[#b58610] border-gray-300 focus:ring-2 focus:ring-[#b58610]"
              />
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="w-full pt-6 mt-4 border-t border-gray-200">
          <p className="uppercase text-xl pb-4 font-medium">Price</p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                $
              </span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                min={0}
                max={maxPrice}
                className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#b58610] focus:border-transparent"
              />
            </div>
            <span className="text-gray-400 text-sm">—</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                $
              </span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                min={minPrice}
                max={15000}
                className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#b58610] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-3">
            <span>${minPrice}</span>
            <span>Up to ${maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Clear All Button */}
      <button
        onClick={clearAllFilters}
        className="w-full mt-6 py-3 text-sm font-medium text-[#b58610] border-2 border-[#b58610] rounded-lg hover:bg-[#b58610] hover:text-white transition-colors duration-300 uppercase tracking-wider"
      >
        Clear All Filters
      </button>
    </div>
  );
};
