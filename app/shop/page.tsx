"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

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

const filter = [
  "Texture & Plaster",
  "Coastal Studies",
  "Colour & Form",
  "Portraiture",
];

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

 
  const filterArtworks = artworks.filter((artwork) =>
    artwork.title.toLowerCase().includes(search.toLowerCase()),
  );

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
        {/* Filters */}
        <div className="w-full md:w-1/4 border-2 border-gray-200 shadow-xl rounded-2xl flex flex-col items-start p-6">
          <div className="w-full">
            <p className="uppercase text-xl pb-4 font-medium">Category</p>
            {filter.map((item, index) => (
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

          <div className="w-full pt-6 mt-4 border-t border-gray-200">
            <p className="uppercase text-xl pb-4 font-medium">Availability</p>
            {["Available", "Reserved", "Sold"].map((status, index) => (
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

          <button
            onClick={clearAllFilters}
            className="w-full mt-6 py-3 text-sm font-medium text-[#b58610] border-2 border-[#b58610] rounded-lg hover:bg-[#b58610] hover:text-white transition-colors duration-300 uppercase tracking-wider"
          >
            Clear All Filters
          </button>
        </div>

      
        <div className="flex-1 border-2 border-gray-200 shadow-xl rounded-2xl p-6">
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
                  <div
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
                  </div>
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
