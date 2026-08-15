"use client";
import { supabase } from "@/app/lib/supabase";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
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
  image_url: string;
  is_available: boolean;
  is_sold: boolean;
};

// ✅ دالة مساعدة للحصول على النص المترجم
const getLocalizedText = (
  artwork: Artwork,
  field: 'title' | 'description' | 'medium',
  language: 'en' | 'ar'
): string => {
  if (language === 'ar') {
    const arField = `${field}_ar` as keyof Artwork;
    return artwork[arField] as string || artwork[field];
  }
  return artwork[field];
};

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
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
        setArtwork(data);
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

  const handleAddToCart = () => {
    if (artwork) {
      const title = getLocalizedText(artwork, 'title', language);
      addToCart({
        id: artwork.id,
        title: title,
        price: artwork.price,
        image_url: artwork.image_url,
        quantity: 1,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F3EC]">
        <div className="w-16 h-16 border-4 border-[#E5D9CA] border-t-[#b58610] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F3EC]">
        <h2 className="text-2xl font-bold text-[#4F3523]">{t("product.notFound")}</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-[#b58610] underline hover:text-[#a0740e] transition-colors"
        >
          {t("product.goBack")}
        </button>
      </div>
    );
  }

  // ✅ الحصول على النصوص المترجمة
  const title = getLocalizedText(artwork, 'title', language);
  const description = getLocalizedText(artwork, 'description', language);
  const medium = getLocalizedText(artwork, 'medium', language);

  // ✅ ترجمة حالة المنتج
  const getStatusLabel = () => {
    if (artwork.is_sold) return t("product.sold");
    if (artwork.is_available) return t("product.available");
    return t("product.reserved");
  };

  const getStatusClass = () => {
    if (artwork.is_sold) return "bg-red-50 text-red-600 border border-red-200";
    if (artwork.is_available) return "bg-[#E5D9CA] text-[#4F3523] border border-[#d7d4cf]";
    return "bg-gray-100 text-[#4F3523]/60 border border-gray-200";
  };

  return (
    <div 
      className="min-h-screen bg-[#F7F3EC] px-4 sm:px-8 lg:px-23 pt-10 pb-14 md:pt-24 lg:pt-28"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* ✅ زر العودة - تم تغيير لونه */}
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-2 text-[#4F3523]/60 hover:text-[#b58610] transition-colors duration-300 mb-6 ${
          language === 'ar' ? 'flex-row-reverse' : ''
        }`}
      >
        <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
        {t("product.backToShop")}
      </button>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* ✅ الصورة - تم تغيير خلفيتها */}
        <div className={`w-full lg:w-1/2 ${language === 'ar' ? 'order-1 lg:order-2' : 'order-1 lg:order-2'}`}>
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#E5D9CA] shadow-md">
            <Image
              src={artwork.image_url}
              alt={title}
              fill
              unoptimized
              className="object-cover hover:scale-105 transition-transform duration-500"
              priority
              onError={(e) => {
                console.warn("Failed to load image:", artwork.image_url);
              }}
            />
          </div>
        </div>

        {/* ✅ المعلومات - تم تغيير ألوان النصوص */}
        <div className={`w-full lg:w-1/2 flex flex-col justify-center ${
          language === 'ar' ? 'order-2 lg:order-1' : 'order-2 lg:order-1'
        }`}>
          {/* ✅ حالة المنتج */}
          <div className="mb-4">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${getStatusClass()}`}>
              {getStatusLabel()}
            </span>
          </div>

          {/* ✅ العنوان */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Cormorant_Garamond'] leading-tight text-[#4F3523]">
            {title}
          </h1>

          {/* ✅ الوسيط */}
          <p className="text-sm text-[#80624A] mt-2 uppercase tracking-wider">
            {medium}
          </p>

          {/* ✅ السعر */}
          <p className="text-3xl font-semibold text-[#b58610] mt-4">
            ${artwork.price.toLocaleString()}
          </p>

          {/* ✅ الوصف */}
          <p className="text-[#4F3523]/80 mt-6 leading-relaxed border-t border-[#E5D9CA] pt-6">
            {description}
          </p>

          {/* ✅ زر الإضافة للسلة - تم تحسينه ليصبح ذهبياً أنيقاً */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 min-w-[140px] px-6 py-3 border-2 border-[#b58610] text-[#b58610] rounded-lg bg-[#b58610]/10 hover:bg-[#b58610] hover:text-white transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={artwork.is_sold}
            >
              {artwork.is_sold ? t("product.soldOut") : t("product.addToCart")}
            </button>
          </div>

          {/* ✅ معلومات إضافية */}
          <div className="mt-8 pt-6 border-t border-[#E5D9CA] grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#4F3523]/60">
                {t("product.medium")}
              </span>
              <span className="text-[#4F3523]/90">{medium}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#4F3523]/60">
                {t("product.status")}
              </span>
              <span className="text-[#4F3523]/90">{getStatusLabel()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;