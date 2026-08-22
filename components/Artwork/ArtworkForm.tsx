"use client";
import React, { useRef } from "react";
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react";

type ArtworkFormProps = {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isUploading: boolean;
  isEditMode: boolean;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

export const ArtworkForm = ({
  formData,
  setFormData,
  isUploading,
  isEditMode,
  onImageSelect,
  onSubmit,
  onClose,
  t,
}: ArtworkFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4F3523]/80 backdrop-blur-sm">
      <div className="bg-[#FAF8F5] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border border-[#E5D9CA]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#4F3523]">
            {isEditMode ? t('modals.edit_artwork.title') : t('modals.add_artwork.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#E5D9CA] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#4F3523]" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* الصف الأول: العنوان بالإنجليزية والسعر الأصلي */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                {t('forms.title')} (EN) *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none text-[#4F3523] focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                {t('forms.price')} *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none text-[#4F3523] focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20"
                required
              />
            </div>
          </div>

          {/* ✅ الصف الجديد: السعر بعد الخصم */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                {t('forms.discount_price') || "سعر الخصم (اختياري)"}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.discount_price || ""}
                onChange={(e) => setFormData({...formData, discount_price: e.target.value})}
                className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none text-[#4F3523] focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20"
                placeholder="اختياري"
              />
              <p className="text-xs text-[#4F3523]/60 mt-1">
                اتركه فارغاً إذا لم يكن هناك خصم.
              </p>
            </div>
          </div>

          {/* الصف الثاني: العنوان بالعربية والخامة بالإنجليزية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                {t('forms.title')} (AR)
              </label>
              <input
                type="text"
                value={formData.title_ar}
                onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none text-[#4F3523] focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20 text-right"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                {t('forms.medium')} (EN)
              </label>
              <input
                type="text"
                value={formData.medium}
                onChange={(e) => setFormData({...formData, medium: e.target.value})}
                className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none text-[#4F3523] focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20"
                placeholder={t('forms.medium_placeholder')}
              />
            </div>
          </div>

          {/* الصف الثالث: الخامة بالعربية والحالة (للتعديل فقط) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                {t('forms.medium')} (AR)
              </label>
              <input
                type="text"
                value={formData.medium_ar}
                onChange={(e) => setFormData({...formData, medium_ar: e.target.value})}
                className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none text-[#4F3523] focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20 text-right"
                dir="rtl"
                placeholder="مثال: زيت على قماش"
              />
            </div>
            
            {/* نعرض حالة التعديل فقط إذا كنا في وضع التعديل */}
            {isEditMode && (
              <div>
                <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                  {t('forms.status')}
                </label>
                <select
                  value={formData.is_available ? "available" : "sold"}
                  onChange={(e) => setFormData({
                    ...formData, 
                    is_available: e.target.value === "available"
                  })}
                  className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none text-[#4F3523] focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20"
                >
                  <option value="available">{t('forms.status_available')}</option>
                  <option value="sold">{t('forms.status_sold')}</option>
                </select>
              </div>
            )}
          </div>

          {/* قسم الوصف */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                {t('forms.description')} (EN)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none resize-none text-[#4F3523] focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                {t('forms.description')} (AR)
              </label>
              <textarea
                value={formData.description_ar}
                onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                rows={5}
                className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none resize-none text-[#4F3523] focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20 text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* قسم رفع الصورة المحسن */}
          <div className="pt-4">
            <label className="block text-sm font-medium text-[#4F3523]/80 mb-3">
              {t('forms.image')}
            </label>
            <div className="border-2 border-dashed border-[#E5D9CA] rounded-2xl p-6 hover:border-[#b58610] transition-colors">
              <div className="flex flex-col items-center">
                
                {/* مربع المعاينة */}
                <div className="w-40 h-40 rounded-xl overflow-hidden bg-[#E5D9CA] mb-5 flex items-center justify-center shadow-sm border border-[#d7d4cf]">
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-14 h-14 text-[#4F3523]/40 opacity-60" />
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onImageSelect}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-6 py-3 rounded-xl bg-[#b58610] text-white hover:bg-[#9f760d] transition flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('forms.uploading')}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {formData.image_url ? t('forms.change_image') : t('forms.upload')}
                    </>
                  )}
                </button>

                <p className="text-xs text-[#4F3523]/60 mt-4">
                  JPG • PNG • WEBP • Max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* زر الحفظ في الأسفل */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3 mt-6 bg-[#b58610] text-white rounded-xl hover:bg-[#a0740e] transition-colors duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditMode ? t('forms.submit_update') : t('forms.submit_add')}
          </button>
        </form>
      </div>
    </div>
  );
};