"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import {
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  MapPin,
  Phone,
  Loader2,
  ImageIcon,
  ShoppingBag,
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
  image_url: string | null;
  is_available: boolean;
  is_sold: boolean;
  created_at: string;
  updated_at: string;
};

type Order = {
  id: number;
  created_at: string;
  name: string;
  name_ar: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  address_ar: string | null;
  items: any;
  total_price: number;
  status: "pending" | "confirmed" | "completed";
};

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Loading states
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    price: "",
    description: "",
    description_ar: "",
    medium: "",
    medium_ar: "",
    image_url: "",
    is_available: true,
  });

  // ============================================
  // التحقق من حالة تسجيل الدخول
  // ============================================

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      setUser(session.user);
      await fetchData();
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ============================================
  // جلب البيانات
  // ============================================

  const fetchData = async () => {
    try {
      const ordersResponse = await fetch("/api/orders");
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

      const { data: artworksData, error: artworksError } = await supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false });

      if (artworksError) throw artworksError;
      setArtworks(artworksData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const openConfirmModal = (order: Order) => {
    setSelectedOrder(order);
    setShowConfirmModal(true);
  };

  // ============================================
  // تأكيد الطلب - تنفيذ التأكيد
  // ============================================

  const confirmOrder = async () => {
    if (!selectedOrder) return;
    setIsConfirming(true);
    try {
      let artworkId = null;
      if (selectedOrder.items) {
        const items =
          typeof selectedOrder.items === "string"
            ? JSON.parse(selectedOrder.items)
            : selectedOrder.items;
        if (items && items.length > 0 && items[0].id) {
          artworkId = items[0].id;
        }
      }

      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: "confirmed",
          artworkId: artworkId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("common.error_confirm_order"));
      }

      setShowConfirmModal(false);
      setSelectedOrder(null);
      await fetchData();
    } catch (error) {
      console.error("Error confirming order:", error);
      alert(
        error instanceof Error
          ? error.message
          : t("common.error_confirm_order"),
      );
    } finally {
      setIsConfirming(false);
    }
  };

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
      await fetchData();
    } catch (error) {
      console.error("Error deleting artwork:", error);
      alert(t("common.error_delete_artwork"));
    } finally {
      setIsDeleting(false);
    }
  };

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
        description: "",
        description_ar: "",
        medium: "",
        medium_ar: "",
        image_url: "",
        is_available: true,
      });
      await fetchData();
    } catch (error) {
      console.error("Error adding artwork:", error);
      alert(t("common.error_add_artwork"));
    }
  };

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
        description: "",
        description_ar: "",
        medium: "",
        medium_ar: "",
        image_url: "",
        is_available: true,
      });
      await fetchData();
    } catch (error) {
      console.error("Error updating artwork:", error);
      alert(t("common.error_update_artwork"));
    }
  };

  const openEditModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setFormData({
      title: artwork.title,
      title_ar: artwork.title_ar || "",
      price: artwork.price.toString(),
      description: artwork.description || "",
      description_ar: artwork.description_ar || "",
      medium: artwork.medium || "",
      medium_ar: artwork.medium_ar || "",
      image_url: artwork.image_url || "",
      is_available: artwork.is_available,
    });
    setShowEditModal(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const totalArtworks = artworks.length;
  const availableArtworks = artworks.filter((a) => a.is_available).length;
  const soldArtworks = artworks.filter((a) => a.is_sold).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

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
    <div className="min-h-screen bg-[#F7F3EC] py-8 px-4  sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4F3523] tracking-tight">
              {t("dashboard.title")}
            </h1>
            <p className="text-[#4F3523]/70 mt-2 text-lg">
              {t("dashboard.welcome_back")}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-[#FAF8F5] border border-[#E5D9CA] text-[#4F3523] rounded-xl hover:bg-[#E5D9CA] hover:border-[#b58610] transition-all duration-200 shadow-sm"
          >
            <span className="font-medium">{t("dashboard.sign_out")}</span>
          </button>
        </div>

        <div className="bg-[#FAF8F5] rounded-2xl shadow-lg border border-[#E5D9CA] mb-12 overflow-hidden shadow-[#4F3523]/10">
          <div className="px-8 py-6 border-b border-[#E5D9CA] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#F7F3EC]/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E5D9CA] rounded-lg">
                <ShoppingBag className="w-5 h-5 text-[#b58610]" />
              </div>
              <h2 className="text-xl font-bold text-[#4F3523]">
                {t("orders.title")}
              </h2>
            </div>
            <span className="px-4 py-1.5 bg-[#E5D9CA] text-[#4F3523] border border-[#d7d4cf] text-sm font-medium rounded-full inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#b58610] animate-pulse"></span>
              {pendingOrders} {t("orders.pending")}
            </span>
          </div>

          {pendingOrders === 0 ? (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E5D9CA] rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-[#b58610]" />
              </div>
              <h3 className="text-xl font-medium text-[#4F3523] mb-1">
                {t("orders.no_orders")}
              </h3>
              <p className="text-[#4F3523]/70">
                Everything is running smoothly.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F7F3EC]/80">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider">
                      {t("orders.table.customer")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider">
                      {t("orders.table.artwork")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider">
                      {t("orders.table.qty")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider">
                      {t("orders.table.phone")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider">
                      {t("orders.table.location")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider">
                      {t("orders.table.total")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider">
                      {t("orders.table.date")}
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-[#4F3523]/70 uppercase tracking-wider">
                      {t("orders.table.action")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5D9CA]">
                  {orders
                    .filter((order) => order.status === "pending")
                    .map((order) => {
                      let artworkTitle = t("common.unknown");
                      let quantity = 1;
                      try {
                        const items =
                          typeof order.items === "string"
                            ? JSON.parse(order.items)
                            : order.items;
                        if (items && items.length > 0) {
                          artworkTitle = items[0].title || t("common.unknown");
                          quantity = items[0].quantity || 1;
                        }
                      } catch (e) {
                        artworkTitle = t("common.unknown");
                      }
                      const customerName =
                        language === "ar" && order.name_ar
                          ? order.name_ar
                          : order.name;
                      const customerAddress =
                        language === "ar" && order.address_ar
                          ? order.address_ar
                          : order.address;
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-[#E5D9CA]/30 transition-colors group"
                        >
                          <td className="px-8 py-5">
                            <div className="text-sm font-medium text-[#4F3523]">
                              {customerName}
                            </div>
                            <div className="text-xs text-[#4F3523]/60">
                              {order.email}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm text-[#4F3523]">
                            {artworkTitle}
                          </td>
                          <td className="px-8 py-5 text-sm text-[#4F3523]">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-[#E5D9CA] rounded-full text-[#4F3523] font-medium">
                              {quantity}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-[#4F3523]/70" />
                              <span className="text-sm text-[#4F3523]">
                                {order.phone || t("common.no_phone")}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-[#4F3523]/70 mt-0.5" />
                              <span className="text-sm text-[#4F3523] max-w-[150px] truncate">
                                {customerAddress || t("common.no_address")}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-[#4F3523]">
                            ₪{order.total_price.toLocaleString()}
                          </td>
                          <td className="px-8 py-5 text-sm text-[#4F3523]/60">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-5">
                            <button
                              onClick={() => openConfirmModal(order)}
                              className="px-4 py-2 bg-[#b58610] text-white text-sm font-medium rounded-xl hover:bg-[#9f760d] transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md shadow-[#b58610]/20"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {t("orders.complete")}
                            </button>
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

      {/* ========================================== استخدام المكون الجديد (Modals) ========================================== */}
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

      {/* ========================================== Confirm Order Modal ========================================== */}
      {showConfirmModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4F3523]/80 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[#E5D9CA]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E5D9CA] rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-[#b58610]" />
              </div>
              <h2 className="text-xl font-bold text-[#4F3523]">
                {t("modals.confirm_order.title")}
              </h2>
              <p className="text-[#4F3523]/70 text-sm mt-2">
                {t("modals.confirm_order.message")}
              </p>
            </div>

            <div className="bg-[#F7F3EC] rounded-lg p-4 mb-6 space-y-2 border border-[#E5D9CA]">
              <div className="flex justify-between text-sm">
                <span className="text-[#4F3523]/70">
                  {t("orders.table.customer")}:
                </span>
                <span className="text-[#4F3523] font-medium">
                  {language === "ar" && selectedOrder.name_ar
                    ? selectedOrder.name_ar
                    : selectedOrder.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4F3523]/70">Email:</span>
                <span className="text-[#4F3523] font-medium">
                  {selectedOrder.email}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4F3523]/70">
                  {t("orders.table.phone")}:
                </span>
                <span className="text-[#4F3523] font-medium">
                  {selectedOrder.phone || t("common.no_phone")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4F3523]/70">
                  {t("orders.table.artwork")}:
                </span>
                <span className="text-[#4F3523] font-medium">
                  {(() => {
                    try {
                      const items =
                        typeof selectedOrder.items === "string"
                          ? JSON.parse(selectedOrder.items)
                          : selectedOrder.items;
                      return items?.[0]?.title || t("common.unknown");
                    } catch (e) {
                      return t("common.unknown");
                    }
                  })()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4F3523]/70">
                  {t("orders.table.location")}:
                </span>
                <span className="text-[#4F3523] font-medium">
                  {language === "ar" && selectedOrder.address_ar
                    ? selectedOrder.address_ar
                    : selectedOrder.address || t("common.no_address")}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-[#E5D9CA]">
                <span className="text-[#4F3523]/70 font-medium">
                  {t("orders.table.total")}:
                </span>
                <span className="text-[#4F3523] font-bold">
                  ₪{selectedOrder.total_price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedOrder(null);
                }}
                disabled={isConfirming}
                className="flex-1 px-4 py-2.5 border border-[#E5D9CA] text-[#4F3523] rounded-lg hover:bg-[#E5D9CA] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={confirmOrder}
                disabled={isConfirming}
                className="flex-1 px-4 py-2.5 bg-[#b58610] text-white rounded-lg hover:bg-[#a0740e] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("modals.confirm_order.confirming")}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {t("common.confirm")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== Delete Artwork Modal ========================================== */}
      {showDeleteModal && selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4F3523]/80 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[#E5D9CA]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4F3523]/10 rounded-full mb-4">
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

export default AdminDashboard;
