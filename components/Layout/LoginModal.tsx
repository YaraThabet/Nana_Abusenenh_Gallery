"use client";
import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { useLanguage } from "@/app/context/LanguageContext"; // تأكد من المسار

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
};

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const router = useRouter();
  const { t, language } = useLanguage(); // <--- جلب الترجمة واللغة

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!email || !password) {
        setError(t("login.error_fill_fields")); // ترجمة
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(t("login.error_invalid_credentials")); // ترجمة
        setIsLoading(false);
        return;
      }

      onClose();
      setEmail("");
      setPassword("");

      if (onLoginSuccess) {
        onLoginSuccess();
      }
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(t("login.error_general")); // ترجمة
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* الخلفية المعتمة */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* النافذة الرئيسية */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300"
          dir={language === "ar" ? "rtl" : "ltr"} // <--- دعم اتجاه الصفحة
        >
          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* زر العودة للمتجر */}
          <button
            onClick={() => router.push("/")}
            className="absolute bottom-4 left-4 flex items-center gap-1 text-xs text-gray-400 hover:text-[#b58610] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            {t("login.back_to_shop")}
          </button>

          {/* رأس النافذة */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#b58610]/10 rounded-full mb-4">
              <User className="w-8 h-8 text-[#b58610]" />
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-light">
              {t("login.title")}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{t("login.subtitle")}</p>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("login.email")}
              </label>
              <div className="relative">
                {/* تحريك أيقونة البريد حسب اللغة */}
                <Mail
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${language === "ar" ? "right-3" : "left-3"}`}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all duration-200 ${language === "ar" ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"}`}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("login.password")}
              </label>
              <div className="relative">
                {/* تحريك أيقونة القفل حسب اللغة */}
                <Lock
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${language === "ar" ? "right-3" : "left-3"}`}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all duration-200 ${language === "ar" ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"}`}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />

                {/* زر إظهار/إخفاء كلمة المرور */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors ${language === "ar" ? "left-3" : "right-3"}`}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#b58610] text-white rounded-lg hover:bg-[#a0740e] transition-colors duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("login.signing_in")}
                </span>
              ) : (
                t("login.sign_in")
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
