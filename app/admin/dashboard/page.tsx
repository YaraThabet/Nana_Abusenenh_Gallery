// app/admin/dashboard/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { 
  Package, 
  ShoppingBag, 
  CheckCircle, 
  ArrowLeft,
  LogOut,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  MapPin,
  Phone,
  Loader2,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Artwork = {
  id: string;
  title: string;
  description: string | null;
  medium: string | null;
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
  email: string;
  phone: string | null;
  address: string | null;
  items: any;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed';
};

const AdminDashboard = () => {
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
    price: "",
    description: "",
    medium: "",
    image_url: "",
    is_available: true,
  });

  // ============================================
  // التحقق من حالة تسجيل الدخول
  // ============================================
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
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

      const ordersResponse = await fetch('/api/orders');
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

      // جلب الأعمال الفنية
      const { data: artworksData, error: artworksError } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

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
      // استخراج artworkId من items
      let artworkId = null;
      if (selectedOrder.items) {
        const items = typeof selectedOrder.items === 'string' 
          ? JSON.parse(selectedOrder.items) 
          : selectedOrder.items;
        if (items && items.length > 0 && items[0].id) {
          artworkId = items[0].id;
        }
      }

      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: 'confirmed',
          artworkId: artworkId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm order');
      }

      setShowConfirmModal(false);
      setSelectedOrder(null);
      await fetchData();

    } catch (error) {
      console.error("Error confirming order:", error);
      alert(error instanceof Error ? error.message : "Error confirming order. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  // ============================================
  // فتح نافذة حذف العمل الفني
  // ============================================
  
  const openDeleteModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setShowDeleteModal(true);
  };

  // ============================================
  // حذف عمل فني - تنفيذ الحذف
  // ============================================
  
  const handleDeleteArtwork = async () => {
    if (!selectedArtwork) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', selectedArtwork.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setSelectedArtwork(null);
      await fetchData();

    } catch (error) {
      console.error("Error deleting artwork:", error);
      alert("Error deleting artwork. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================
  // رفع الصورة إلى Supabase Storage
  // ============================================
  
  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);

      // إنشاء اسم فريد للصورة
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `artworks/${fileName}`;

      // رفع الصورة إلى Supabase Storage
      const { data, error } = await supabase.storage
        .from('artworks')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // الحصول على الرابط العام للصورة
      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);

      // تحديث formData بالرابط
      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));

      setIsUploading(false);
      return publicUrl;

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
      setIsUploading(false);
      return null;
    }
  };

  // ============================================
  // معالج اختيار الصورة
  // ============================================
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WEBP, GIF)');
      return;
    }

    // التحقق من حجم الملف (حد أقصى 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
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
        .from('artworks')
        .insert([
          {
            title: formData.title,
            price: Number(formData.price),
            description: formData.description || null,
            medium: formData.medium || null,
            image_url: formData.image_url || null,
            is_available: true,
            is_sold: false,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setShowAddModal(false);
      setFormData({
        title: "",
        price: "",
        description: "",
        medium: "",
        image_url: "",
        is_available: true,
      });
      await fetchData();

    } catch (error) {
      console.error("Error adding artwork:", error);
      alert("Error adding artwork. Please try again.");
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
        .from('artworks')
        .update({
          title: formData.title,
          price: Number(formData.price),
          description: formData.description || null,
          medium: formData.medium || null,
          image_url: formData.image_url || null,
          is_available: formData.is_available,
          is_sold: !formData.is_available,
        })
        .eq('id', selectedArtwork.id)
        .select()
        .single();

      if (error) throw error;

      setShowEditModal(false);
      setSelectedArtwork(null);
      setFormData({
        title: "",
        price: "",
        description: "",
        medium: "",
        image_url: "",
        is_available: true,
      });
      await fetchData();

    } catch (error) {
      console.error("Error updating artwork:", error);
      alert("Error updating artwork. Please try again.");
    }
  };

  // ============================================
  // فتح نافذة التعديل
  // ============================================
  
  const openEditModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setFormData({
      title: artwork.title,
      price: artwork.price.toString(),
      description: artwork.description || "",
      medium: artwork.medium || "",
      image_url: artwork.image_url || "",
      is_available: artwork.is_available,
    });
    setShowEditModal(true);
  };

  // ============================================
  // تسجيل الخروج
  // ============================================
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // ============================================
  // حساب الإحصائيات
  // ============================================
  
  const totalArtworks = artworks.length;
  const availableArtworks = artworks.filter(a => a.is_available).length;
  const soldArtworks = artworks.filter(a => a.is_sold).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b58610] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-30 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">
                Welcome back, {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Artworks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalArtworks}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Available</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{availableArtworks}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            Orders Section - طلبات الانتظار فقط
            ========================================== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Pending Orders</h2>
            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-sm font-medium rounded-full">
              {pendingOrders} pending
            </span>
          </div>

          {pendingOrders === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No pending orders
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artwork
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders
                    .filter(order => order.status === 'pending')
                    .map((order) => {
                      // استخراج معلومات اللوحة من items
                      let artworkTitle = 'Unknown';
                      let quantity = 1;
                      try {
                        const items = typeof order.items === 'string' 
                          ? JSON.parse(order.items) 
                          : order.items;
                        if (items && items.length > 0) {
                          artworkTitle = items[0].title || 'Unknown';
                          quantity = items[0].quantity || 1;
                        }
                      } catch (e) {
                        artworkTitle = 'Unknown';
                      }

                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{order.name}</div>
                            <div className="text-xs text-gray-500">{order.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {artworkTitle}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {quantity}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {order.phone || 'No phone'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {order.address || 'No address'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            ${order.total_price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => openConfirmModal(order)}
                              className="px-4 py-2 bg-[#b58610] text-white text-sm rounded-lg hover:bg-[#a0740e] transition-colors duration-200 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Complete
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

        {/* ==========================================
            Artworks Section
            ========================================== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Artworks</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#b58610] text-white text-sm rounded-lg hover:bg-[#a0740e] transition-colors duration-200 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Artwork
            </button>
          </div>

          {artworks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No artworks added yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medium
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {artworks.map((artwork) => (
                    <tr key={artwork.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                          {artwork.image_url ? (
                            <img
                              src={artwork.image_url}
                              alt={artwork.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {artwork.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {artwork.medium || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${artwork.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          artwork.is_available 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {artwork.is_sold ? 'Sold' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(artwork)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(artwork)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          Confirm Order Modal
          ========================================== */}
      {showConfirmModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Confirm Order</h2>
              <p className="text-gray-500 text-sm mt-2">
                Are you sure you want to confirm this order?
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Customer:</span>
                <span className="text-gray-900 font-medium">{selectedOrder.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-900 font-medium">{selectedOrder.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone:</span>
                <span className="text-gray-900 font-medium">
                  {selectedOrder.phone || 'No phone provided'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Artwork:</span>
                <span className="text-gray-900 font-medium">
                  {(() => {
                    try {
                      const items = typeof selectedOrder.items === 'string' 
                        ? JSON.parse(selectedOrder.items) 
                        : selectedOrder.items;
                      return items?.[0]?.title || 'Unknown';
                    } catch (e) {
                      return 'Unknown';
                    }
                  })()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Location:</span>
                <span className="text-gray-900 font-medium">
                  {selectedOrder.address || 'No address provided'}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="text-gray-500 font-medium">Total:</span>
                <span className="text-gray-900 font-bold">
                  ${selectedOrder.total_price.toLocaleString()}
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
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                disabled={isConfirming}
                className="flex-1 px-4 py-2.5 bg-[#b58610] text-white rounded-lg hover:bg-[#a0740e] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          Delete Artwork Modal
          ========================================== */}
      {showDeleteModal && selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Artwork</h2>
              <p className="text-gray-500 text-sm mt-2">
                Are you sure you want to delete this artwork?
              </p>
              <p className="text-gray-400 text-xs mt-1">
                This action cannot be undone.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {selectedArtwork.image_url ? (
                    <img
                      src={selectedArtwork.image_url}
                      alt={selectedArtwork.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedArtwork.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${selectedArtwork.price.toLocaleString()}
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
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteArtwork}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          Add Artwork Modal
          ========================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Artwork</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddArtwork} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Medium
                </label>
                <input
                  type="text"
                  value={formData.medium}
                  onChange={(e) => setFormData({...formData, medium: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none"
                  placeholder="e.g., Oil on Canvas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  {formData.image_url && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#b58610] transition-colors duration-200 flex items-center justify-center gap-2 text-gray-600 hover:text-[#b58610] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : formData.image_url ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Change Image
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </>
                      )}
                    </button>
                    {formData.image_url && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {formData.image_url.split('/').pop()}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Max 5MB · JPG, PNG, WEBP, GIF
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-[#b58610] text-white rounded-lg hover:bg-[#a0740e] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Artwork
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          Edit Artwork Modal
          ========================================== */}
      {showEditModal && selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Artwork</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditArtwork} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Medium
                </label>
                <input
                  type="text"
                  value={formData.medium}
                  onChange={(e) => setFormData({...formData, medium: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none"
                  placeholder="e.g., Oil on Canvas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  {formData.image_url && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#b58610] transition-colors duration-200 flex items-center justify-center gap-2 text-gray-600 hover:text-[#b58610] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : formData.image_url ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Change Image
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </>
                      )}
                    </button>
                    {formData.image_url && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {formData.image_url.split('/').pop()}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Max 5MB · JPG, PNG, WEBP, GIF
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.is_available ? "available" : "sold"}
                  onChange={(e) => setFormData({
                    ...formData, 
                    is_available: e.target.value === "available"
                  })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none"
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-[#b58610] text-white rounded-lg hover:bg-[#a0740e] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Artwork
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;