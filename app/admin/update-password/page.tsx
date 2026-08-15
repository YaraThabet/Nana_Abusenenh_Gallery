"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { useLanguage } from "@/app/context/LanguageContext";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function UpdatePasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // الاستماع لحدث استعادة كلمة المرور من Supabase
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // حدث استعادة كلمة المرور تم بنجاح، يمكننا الآن عرض النموذج
        setLoading(false);
      } else if (event === 'SIGNED_IN') {
        // إذا كان المستخدم قد سجل الدخول بالفعل، ننقله للداشبورد
        router.push("/admin/dashboard");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  // دالة إعادة تعيين كلمة المرور
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // التحقق من صحة كلمة المرور
    if (password.length < 6) {
      setMessage({ type: 'error', text: t("settings.password_too_short") });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: t("settings.password_mismatch") });
      return;
    }

    setUpdating(true);
    try {
      // تحديث كلمة المرور في Supabase باستخدام الـ token الموجود في الرابط
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error(error.message);

      setMessage({ type: 'success', text: t("settings.success_message") });

      // الانتظار 2 ثانية ثم التوجيه إلى الداشبورد
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || t("settings.error_message") });
    } finally {
      setUpdating(false);
    }
  };

  // حالة التحميل (لحين وصول حدث PASSWORD_RECOVERY)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#E5D9CA] border-t-[#b58610] rounded-full animate-spin mb-4" />
          <p className="text-[#4F3523]/70 text-sm">جاري تحميل جلسة استعادة كلمة المرور...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] px-4 py-20 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-sm border border-[#E5D9CA] shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light font-['Cormorant_Garamond'] text-[#4F3523]">
            {t("settings.change_password")}
          </h1>
          <p className="text-sm text-[#4F3523]/70 mt-2">
            أدخل كلمة المرور الجديدة الخاصة بك.
          </p>
        </div>

        {/* رسائل الخطأ / النجاح */}
        {message && (
          <div className={`mb-6 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50/80 text-green-700 border border-green-200' : 'bg-red-50/80 text-red-600 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          {/* كلمة المرور الجديدة */}
          <div>
            <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
              {t("settings.new_password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2.5 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all duration-200 px-4 pr-10 text-[#4F3523] placeholder:text-[#4F3523]/50"
                placeholder="••••••••"
                required
                disabled={updating}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F3523]/60 hover:text-[#4F3523] transition-colors"
                disabled={updating}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
              className="w-full py-2.5 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all duration-200 px-4 text-[#4F3523] placeholder:text-[#4F3523]/50"
              placeholder="••••••••"
              required
              disabled={updating}
            />
          </div>

          {/* زر الحفظ */}
          <button
            type="submit"
            disabled={updating}
            className="w-full py-3 bg-[#b58610] text-white rounded-xl hover:bg-[#a0740e] transition-colors duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {updating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("settings.saving")}
              </span>
            ) : (
              "تحديث كلمة المرور"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}