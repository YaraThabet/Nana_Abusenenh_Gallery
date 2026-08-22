"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { ArtworkForm } from "@/components/Artwork/ArtworkForm";

type Artwork = {
  id: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  description_ar: string | null;
  medium: string | null;
  medium_ar: string | null;
  price: number;
  discount_price: number | null; // <--- إضافة حقل الخصم
  image_url: string | null;
  is_available: boolean;
  is_sold: boolean;
  created_at: string;
  updated_at: string;
};

const AdminArtworksPage = () => {
  const { t, language } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Loading states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    price: "",
    discount_price: "", // <--- إضافة حقل الخصم
    description: "",
    description_ar: "",
    medium: "",
    medium_ar: "",
    image_url: "",
    is_available: true,
  });

  // ============================================
  // جلب البيانات
  // ============================================

  useEffect(() => {
    fetchArtworks();
    setLoading(false);
  }, []);

  const fetchArtworks = async () => {
    try {
      const { data: artworksData, error: artworksError } = await supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false });

      if (artworksError) throw artworksError;
      setArtworks(artworksData || []);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  // ============================================
  // رفع الصورة ومعالجتها
  // ============================================

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `artworks/${fileName}`;

      const { error } = await supabase.storage
        .from("artworks")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("artworks").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
      setIsUploading(false);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t("common.error_upload_image"));
      setIsUploading(false);
      return null;
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert(t("common.error_invalid_file"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(t("common.error_file_size"));
      return;
    }
    uploadImage(file);
  };

  // ============================================
  // إضافة عمل فني جديد
  // ============================================

  const handleAddArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("artworks")
        .insert([
          {
            title: formData.title,
            title_ar: formData.title_ar || null,
            price: Number(formData.price),
            discount_price: formData.discount_price
              ? Number(formData.discount_price)
              : null, // <--- إضافة الخصم
            description: formData.description || null,
            description_ar: formData.description_ar || null,
            medium: formData.medium || null,
            medium_ar: formData.medium_ar || null,
            image_url: formData.image_url || null,
            is_available: true,
            is_sold: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setShowAddModal(false);
      setFormData({
        title: "",
        title_ar: "",
        price: "",
        discount_price: "",
        description: "",
        description_ar: "",
        medium: "",
        medium_ar: "",
        image_url: "",
        is_available: true,
      });
      await fetchArtworks();
    } catch (error) {
      console.error("Error adding artwork:", error);
      alert(t("common.error_add_artwork"));
    }
  };

  // ============================================
  // تعديل عمل فني
  // ============================================

  const handleEditArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtwork) return;
    try {
      const { data, error } = await supabase
        .from("artworks")
        .update({
          title: formData.title,
          title_ar: formData.title_ar || null,
          price: Number(formData.price),
          discount_price: formData.discount_price
            ? Number(formData.discount_price)
            : null, // <--- إضافة الخصم
          description: formData.description || null,
          description_ar: formData.description_ar || null,
          medium: formData.medium || null,
          medium_ar: formData.medium_ar || null,
          image_url: formData.image_url || null,
          is_available: formData.is_available,
          is_sold: !formData.is_available,
        })
        .eq("id", selectedArtwork.id)
        .select()
        .single();

      if (error) throw error;
      setShowEditModal(false);
      setSelectedArtwork(null);
      setFormData({
        title: "",
        title_ar: "",
        price: "",
        discount_price: "",
        description: "",
        description_ar: "",
        medium: "",
        medium_ar: "",
        image_url: "",
        is_available: true,
      });
      await fetchArtworks();
    } catch (error) {
      console.error("Error updating artwork:", error);
      alert(t("common.error_update_artwork"));
    }
  };

  // ============================================
  // حذف عمل فني
  // ============================================

  const openDeleteModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setShowDeleteModal(true);
  };

  const handleDeleteArtwork = async () => {
    if (!selectedArtwork) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("artworks")
        .delete()
        .eq("id", selectedArtwork.id);
      if (error) throw error;
      setShowDeleteModal(false);
      setSelectedArtwork(null);
      await fetchArtworks();
    } catch (error) {
      console.error("Error deleting artwork:", error);
      alert(t("common.error_delete_artwork"));
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================
  // فتح نوافذ التعديل والإضافة
  // ============================================

  const openEditModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setFormData({
      title: artwork.title,
      title_ar: artwork.title_ar || "",
      price: artwork.price.toString(),
      discount_price: artwork.discount_price?.toString() || "", // <--- تعبئة الخصم عند التعديل
      description: artwork.description || "",
      description_ar: artwork.description_ar || "",
      medium: artwork.medium || "",
      medium_ar: artwork.medium_ar || "",
      image_url: artwork.image_url || "",
      is_available: artwork.is_available,
    });
    setShowEditModal(true);
  };

  // ============================================
  // حالة التحميل
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b58610] mx-auto"></div>
          <p className="mt-4 text-[#4F3523]/70">{t("dashboard.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] py-8 px-4 pt-30 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#FAF8F5] rounded-2xl shadow-lg border border-[#E5D9CA] overflow-hidden shadow-[#4F3523]/10">
          <div className="px-8 py-6 border-b border-[#E5D9CA] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#F7F3EC]/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E5D9CA] rounded-lg">
                <ImageIcon className="w-5 h-5 text-[#b58610]" />
              </div>
              <h2 className="text-xl font-bold text-[#4F3523]">
                {t("artworks.title")}
              </h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#b58610] text-white text-sm font-medium rounded-xl hover:bg-[#9f760d] transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              {t("artworks.add")}
            </button>
          </div>

          {artworks.length === 0 ? (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E5D9CA] rounded-full mb-4">
                <ImageIcon className="w-10 h-10 text-[#b58610]" />
              </div>
              <h3 className="text-xl font-medium text-[#4F3523] mb-1">
                {t("artworks.no_artworks")}
              </h3>
              <p className="text-[#4F3523]/70">
                Start by adding your first piece.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                {/* <--- زيادة العرض لتجنب تكسر الجدول */}
                <thead className="bg-[#F7F3EC]/80">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider min-w-[100px]">
                      {t("artworks.table.image")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider min-w-[140px]">
                      {t("artworks.table.title")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider min-w-[120px]">
                      {t("artworks.table.medium")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider min-w-[100px]">
                      {t("artworks.table.original_price")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider min-w-[120px]">
                      {t("artworks.table.discount_price")}
                    </th>

                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider min-w-[100px]">
                      {t("artworks.table.status")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider min-w-[100px]">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5D9CA]">
                  {artworks.map((artwork) => {
                    const displayTitle =
                      language === "ar" && artwork.title_ar
                        ? artwork.title_ar
                        : artwork.title;
                    const displayMedium =
                      language === "ar" && artwork.medium_ar
                        ? artwork.medium_ar
                        : artwork.medium || "-";
                    return (
                      <tr
                        key={artwork.id}
                        className="hover:bg-[#E5D9CA]/30 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-[#E5D9CA] border border-[#d7d4cf] shadow-sm">
                            {artwork.image_url ? (
                              <img
                                src={artwork.image_url}
                                alt={artwork.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-[#4F3523]/50" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-medium text-[#4F3523]">
                          {displayTitle}
                        </td>
                        <td className="px-8 py-5 text-sm text-[#4F3523]/70">
                          {displayMedium}
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-[#4F3523]">
                          ₪{artwork.price.toLocaleString()}
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-[#b58610]">
                          {artwork.discount_price
                            ? `₪${artwork.discount_price.toLocaleString()}`
                            : "-"}
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              artwork.is_available
                                ? "bg-[#E5D9CA] text-[#4F3523]"
                                : "bg-red-100/50 text-red-600"
                            }`}
                          >
                            {artwork.is_sold
                              ? t("artworks.status.sold")
                              : t("artworks.status.available")}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(artwork)}
                              className="p-2 text-[#4F3523]/60 hover:bg-[#E5D9CA] hover:text-[#b58610] rounded-lg transition-colors"
                              title={t("common.edit")}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(artwork)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title={t("common.delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ... (باقي Modals كما هو) */}

      {/* ==========================================
          المودالات (Add / Edit / Delete)
          ========================================== */}
      {showAddModal && (
        <ArtworkForm
          formData={formData}
          setFormData={setFormData}
          isUploading={isUploading}
          isEditMode={false}
          onImageSelect={handleImageSelect}
          onSubmit={handleAddArtwork}
          onClose={() => setShowAddModal(false)}
          t={t}
        />
      )}

      {showEditModal && (
        <ArtworkForm
          formData={formData}
          setFormData={setFormData}
          isUploading={isUploading}
          isEditMode={true}
          onImageSelect={handleImageSelect}
          onSubmit={handleEditArtwork}
          onClose={() => setShowEditModal(false)}
          t={t}
        />
      )}

      {showDeleteModal && selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4F3523]/80 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[#E5D9CA]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E5D9CA] rounded-full mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-[#4F3523]">
                {t("modals.delete_artwork.title")}
              </h2>
              <p className="text-[#4F3523]/70 text-sm mt-2">
                {t("modals.delete_artwork.message")}
              </p>
              <p className="text-[#4F3523]/50 text-xs mt-1">
                {t("modals.delete_artwork.warning")}
              </p>
            </div>
            <div className="bg-[#F7F3EC] rounded-lg p-4 mb-6 border border-[#E5D9CA]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#E5D9CA] flex-shrink-0">
                  {selectedArtwork.image_url ? (
                    <img
                      src={selectedArtwork.image_url}
                      alt={selectedArtwork.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-[#4F3523]/50" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4F3523]">
                    {language === "ar" && selectedArtwork.title_ar
                      ? selectedArtwork.title_ar
                      : selectedArtwork.title}
                  </p>
                  <p className="text-xs text-[#4F3523]/60">
                    ₪{selectedArtwork.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedArtwork(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 border border-[#E5D9CA] text-[#4F3523] rounded-lg hover:bg-[#E5D9CA] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDeleteArtwork}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("modals.delete_artwork.deleting")}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    {t("common.delete")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArtworksPage;
