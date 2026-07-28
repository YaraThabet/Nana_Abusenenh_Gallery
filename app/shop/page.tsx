"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { FilterSidebar } from "@/components/Shop/FilterSidebar";
import Link from "next/link";

type Artwork = {
  id: string;
  title: string;
  description: string;
  medium: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_sold: boolean;
};

const Page = () => {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<
    string | null
  >(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false); // ✅ حالة فتح الفلترة في الجوال

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

  const filterArtworks = artworks.filter((artwork) => {
    const matchesSearch = artwork.title.toLowerCase().includes(
      search.toLowerCase(),
    );
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(artwork.medium);
    let matchesAvailability = true;
    if (selectedAvailability === "Available") {
      matchesAvailability = artwork.is_available && !artwork.is_sold;
    } else if (selectedAvailability === "Sold") {
      matchesAvailability = artwork.is_sold;
    }
    const matchesPrice = artwork.price >= minPrice && artwork.price <= maxPrice;

    return (
      matchesSearch && matchesCategory && matchesAvailability && matchesPrice
    );
  });

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedAvailability(null);
    setMinPrice(0);
    setMaxPrice(15000);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 lg:px-23 pt-10 md:pt-24 lg:pt-28 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <div className="text-center sm:text-left">
          <p className="uppercase text-[#b58610] text-xs sm:text-sm tracking-widest font-medium">
            The Full Collection
          </p>
          <h1 className='uppercase font-bold font-["Cormorant_Garamond"] text-xl sm:text-3xl md:text-3xl'>
            Shop Original Paintings
          </h1>
        </div>
        <div className="flex flex-row w-full sm:w-80 h-12 rounded-full border-2 border-gray-200 bg-white/50 backdrop-blur-sm items-center hover:border-[#b58610] focus-within:border-[#b58610] focus-within:shadow-lg transition-all duration-300">
          <Search className="text-gray-400 ml-4 mr-2 w-5 h-5 transition-colors duration-300 group-focus-within:text-[#b58610]" />
          <input
            type="search"
            placeholder="Search paintings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full outline-none bg-transparent text-sm pr-4 text-gray-700 placeholder:text-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="w-full flex-1 pt-8 pb-5 flex flex-col md:flex-row gap-6">
        <div className="md:hidden flex justify-between items-center mb-2">
          <button
            onClick={() => setOpenFilter(true)}
            className="px-5 py-3 border-2 border-[#b58610] text-[#b58610] rounded-lg uppercase text-sm font-medium hover:bg-[#b58610] hover:text-white transition-colors duration-300"
          >
            <SlidersHorizontal className="w-4 h-4 inline mr-2" />
            Filters
          </button>
          <span className="text-sm text-gray-400">
            {filterArtworks.length} results
          </span>
        </div>

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

        {openFilter && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              onClick={() => setOpenFilter(false)}
              className="absolute inset-0 bg-black/50"
            />

            <div
              className="
                absolute
                left-0
                top-0
                h-full
                w-[85%]
                max-w-sm
                bg-white
                shadow-2xl
                p-5
                overflow-y-auto
              "
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setOpenFilter(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
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
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 border-2 border-gray-200 shadow-xl rounded-2xl p-6 min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#b58610] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 text-sm">Loading artworks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterArtworks.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    No paintings found
                  </h3>
                  <p className="text-gray-400 max-w-sm">
                    {search
                      ? `We couldn't find any paintings matching "${search}". Try searching for something else.`
                      : "Start typing to search for paintings."}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="mt-6 px-6 py-2 text-sm font-medium text-[#b58610] border-2 border-[#b58610] rounded-full hover:bg-[#b58610] hover:text-white transition-all duration-300"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                filterArtworks.map((artwork) => (
                  <Link
                    href={`/shop/${artwork.id}`}
                    key={artwork.id}
                    className="group border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition duration-300"
                  >
                    <div className="w-full h-64 overflow-hidden">
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className='font-["Cormorant_Garamond"] text-xl font-bold'>
                        {artwork.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {artwork.description}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-[#b58610] font-semibold">
                          ${artwork.price}
                        </span>
                        {artwork.is_sold ? (
                          <span className="text-red-500 text-sm">Sold</span>
                        ) : artwork.is_available ? (
                          <span className="text-green-600 text-sm">
                            Available
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            Reserved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {artwork.medium}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
