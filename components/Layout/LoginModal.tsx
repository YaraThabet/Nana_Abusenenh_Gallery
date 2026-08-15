"use client";
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { useLanguage } from "@/app/context/LanguageContext";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
};

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [isResetMode, setIsResetMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  // =========================
  // تسجيل الدخول
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!email || !password) {
        setError(t("login.error_fill_fields"));
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(t("login.error_invalid_credentials"));
        setIsLoading(false);
        return;
      }

      onClose();
      setEmail("");
      setPassword("");
      setIsResetMode(false);

      if (onLoginSuccess) {
        onLoginSuccess();
      }
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(t("login.error_general"));
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // استعادة كلمة المرور (تم تعديل الـ Catch هنا)
  // =========================
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setError("");
    setResetSuccess("");

    try {
      if (!email) {
        setError(t("login.error_fill_fields"));
        setIsResetting(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/update-password`,
      });

      if (error) throw new Error(error.message);

      setResetSuccess(t("login.reset_success"));
      setEmail("");
    } catch (err: any) {
      console.error("Reset password error:", err); // يبقى الخطأ مرئياً لك في الـ Console

      // ✅ التعديل الجديد: التحقق من رسالة حد البريد الإلكتروني
      if (err?.message?.toLowerCase().includes("rate limit")) {
        setError(t("login.error_rate_limit")); // رسالة لطيفة للمستخدم
      } else {
        setError(err.message || t("login.error_general"));
      }
    } finally {
      setIsResetting(false);
    }
  };

  const toggleMode = () => {
    setIsResetMode(!isResetMode);
    setError("");
    setResetSuccess("");
    setEmail("");
    setPassword("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ==========================================
          الخلفية المعتمة - تم تغييرها إلى بيج داكن مع شفافية 80%
      ========================================== */}
      <div
        className="fixed inset-0 z-50 bg-[#d7d4cf]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* النافذة الرئيسية */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto relative bg-[#F7F3EC] rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-[#E5D9CA] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#4F3523]/60" />
          </button>

          {/* زر العودة للمتجر */}
          <button
            onClick={() => router.push("/")}
            className={`absolute bottom-4 ${language === 'ar' ? 'left-4' : 'left-4'} flex items-center gap-1 text-[10px] text-[#4F3523]/50 hover:text-[#b58610] transition-colors`}
          >
            <ArrowLeft className={`w-3 h-3 ${language === 'ar' ? 'rotate-180' : ''}`} />
            {t("login.back_to_shop")}
          </button>

          {/* رأس النافذة */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#b58610]/10 rounded-full mb-4">
              <User className="w-8 h-8 text-[#b58610]" />
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#4F3523]">
              {isResetMode ? t("login.reset_title") : t("login.title")}
            </h2>
            <p className="text-[#4F3523]/70 text-sm mt-1">
              {isResetMode ? t("login.reset_subtitle") : t("login.subtitle")}
            </p>
          </div>

          {/* رسالة الخطأ / النجاح */}
          {error && (
            <div className="mb-4 p-3 bg-red-50/80 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          {resetSuccess && (
            <div className="mb-4 p-3 bg-green-50/80 border border-green-200 rounded-lg text-green-600 text-sm">
              {resetSuccess}
            </div>
          )}

          {/* وضعية تسجيل الدخول */}
          {!isResetMode && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                  {t("login.email")}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#4F3523]/60 ${language === "ar" ? "right-3" : "left-3"}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full py-2.5 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all duration-200 ${language === "ar" ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"} text-[#4F3523] placeholder:text-[#4F3523]/50`}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                  {t("login.password")}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#4F3523]/60 ${language === "ar" ? "right-3" : "left-3"}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full py-2.5 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all duration-200 ${language === "ar" ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"} text-[#4F3523] placeholder:text-[#4F3523]/50`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-[#4F3523]/60 hover:text-[#4F3523] transition-colors ${language === "ar" ? "left-3" : "right-3"}`}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* زر نسيت كلمة المرور */}
              {/* <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'} mt-1`}>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-xs font-medium text-[#b58610] hover:underline transition-all"
                >
                  {t("login.forgot_password")}
                </button>
              </div> */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 bg-[#b58610] text-white rounded-xl hover:bg-[#a0740e] transition-colors duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("login.signing_in")}
                  </span>
                ) : (
                  t("login.sign_in")
                )}
              </button>
            </form>
          )}

          {/* وضعية استعادة كلمة المرور */}
          {isResetMode && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">
                  {t("login.email")}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#4F3523]/60 ${language === "ar" ? "right-3" : "left-3"}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full py-2.5 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all duration-200 ${language === "ar" ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"} text-[#4F3523] placeholder:text-[#4F3523]/50`}
                    required
                    disabled={isResetting}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full py-3 mt-2 bg-[#b58610] text-white rounded-xl hover:bg-[#a0740e] transition-colors duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("login.sending")}
                  </span>
                ) : (
                  t("login.send_reset_link")
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-xs text-[#4F3523]/50 hover:text-[#b58610] underline transition-colors"
                >
                  {t("login.back_to_login")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginModal;