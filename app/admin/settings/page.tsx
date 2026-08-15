"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

const AdminSettingsPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // حالة النموذج
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // رسائل التغذية الراجعة
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // جلب المستخدم الحالي لملء حقل البريد الإلكتروني
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/"); 
        return;
      }
      setEmail(user.email || "");
      setLoading(false);
    };
    getUser();
  }, [router]);

  // ============================================
  // دالة حفظ الإعدادات
  // ============================================
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // 1. تحديث البريد الإلكتروني
      if (email !== (await supabase.auth.getUser()).data.user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw new Error(emailError.message);
      }

      // 2. تحديث كلمة المرور
      if (newPassword) {
        if (newPassword.length < 6) {
          throw new Error(t("settings.password_too_short"));
        }
        if (newPassword !== confirmPassword) {
          throw new Error(t("settings.password_mismatch"));
        }

        const { error: passError } = await supabase.auth.updateUser({ 
          password: newPassword 
        });
        if (passError) throw new Error(passError.message);
        
        setNewPassword("");
        setConfirmPassword("");
      }

      setMessage({ 
        text: t("settings.success_message"), 
        type: 'success' 
      });

    } catch (error: any) {
      setMessage({ 
        text: error.message || t("settings.error_message"), 
        type: 'error' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-[#F7F3EC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#b58610]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] py-8 px-4 pt-30 sm:px-8 lg:px-12">
      <div className="max-w-2xl mx-auto">
        
        {/* بطاقة الإعدادات */}
        <div className="bg-[#FAF8F5] rounded-2xl shadow-lg border border-[#E5D9CA] p-6 md:p-8 shadow-[#4F3523]/10">
          
          {/* رأس الصفحة مع زر العودة */}
          <div className="flex items-center gap-4 mb-6 border-b border-[#E5D9CA] pb-4">
            <Link href="/admin/dashboard" className="p-2 hover:bg-[#E5D9CA] rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#4F3523]/60" />
            </Link>
            <h1 className="text-2xl font-bold text-[#4F3523]">{t("settings.title")}</h1>
          </div>

          {/* رسالة النجاح أو الخطأ */}
          {message && (
            <div className={`p-4 mb-6 rounded-xl text-sm border ${
              message.type === 'success' 
                ? 'bg-green-50/80 text-[#4F3523] border-green-200' 
                : 'bg-red-50/80 text-red-600 border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateSettings} className="space-y-8">
            
            {/* قسم البريد الإلكتروني */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#4F3523]/70 uppercase tracking-wider">
                {t("settings.email_section") || "البريد الإلكتروني"}
              </h3>
              <div>
                <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                  {t("settings.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none text-[#4F3523] placeholder:text-[#4F3523]/50 focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20 transition-all"
                  placeholder="admin@example.com"
                />
                <p className="text-xs text-[#4F3523]/60 mt-2">
                  {t("settings.email_verification_note") || "ملاحظة: تغيير البريد الإلكتروني قد يتطلب تأكيد البريد الجديد."}
                </p>
              </div>
            </div>

            <hr className="border-[#E5D9CA]" />

            {/* قسم كلمة المرور */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#4F3523]/70 uppercase tracking-wider">
                {t("settings.change_password")}
              </h3>
              
              <div className="space-y-4">
                {/* كلمة المرور الجديدة */}
                <div>
                  <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                    {t("settings.new_password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none text-[#4F3523] placeholder:text-[#4F3523]/50 focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20 transition-all pr-10"
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F3523]/60 hover:text-[#4F3523] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#4F3523]/60 mt-2">{t("settings.password_hint")}</p>
                </div>

                {/* تأكيد كلمة المرور */}
                <div>
                  <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                    {t("settings.confirm_password")}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#E5D9CA] bg-white/50 px-4 py-3 outline-none text-[#4F3523] placeholder:text-[#4F3523]/50 focus:border-[#b58610] focus:ring-2 focus:ring-[#b58610]/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* زر الحفظ */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full md:w-auto px-8 py-3 bg-[#b58610] text-white rounded-xl hover:bg-[#a0740e] transition-colors duration-200 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("settings.saving")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t("settings.save_changes")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;