"use client";
import { supabase } from "@/app/lib/supabase";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

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

const page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [idArtwork, setIdArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("artworks")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        console.log("🖼️ Image URL:", data.image_url);
        setIdArtwork(data);
      } catch (error) {
        console.error("Error fetching artwork:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchArtwork();
    }
  }, [id]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#b58610] rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!idArtwork) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">Artwork not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-[#b58610] underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-23 pt-10 md:pt-24 lg:pt-28">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-[#b58610] transition-colors duration-300 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Shop
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2">
          <Image
            src={`/${idArtwork.image_url}`}
            alt="Artwork"
            width={400}
            height={400}
            unoptimized
            className="object-cover rounded-2xl"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold font-['Cormorant_Garamond']">
            {idArtwork.title}
          </h1>

          <p className="text-sm text-gray-500 mt-2 uppercase tracking-wider">
            {idArtwork.medium}
          </p>

          <p className="text-2xl font-semibold text-[#b58610] mt-4">
            ${idArtwork.price}
          </p>

          <div className="mt-4">
            {idArtwork.is_sold ? (
              <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Sold
              </span>
            ) : idArtwork.is_available ? (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Available
              </span>
            ) : (
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                Reserved
              </span>
            )}
          </div>

          <p className="text-gray-600 mt-6 leading-relaxed">
            {idArtwork.description}
          </p>

          <div className="mt-8">
            <button className="px-8 py-3 border-2 border-[#b58610] text-[#b58610] rounded-lg hover:bg-[#b58610] hover:text-white transition-colors duration-300">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default page;
