"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useLanguage } from "@/app/context/LanguageContext";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SecretLoginPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || t("login.error_invalid_credentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md">
        
        {/* ✅ زر العودة إلى الصفحة الرئيسية */}
        <Link
          href="/"
          className={`inline-flex items-center gap-2 text-[#4F3523]/60 hover:text-[#b58610] transition-colors duration-300 mb-6 text-sm font-medium ${
            language === 'ar' ? 'flex-row-reverse' : ''
          }`}
        >
          <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          {t("login.back_to_shop") || "العودة إلى الرئيسية"}
        </Link>

        {/* نموذج الدخول */}
        <div className="bg-[#FAF8F5] border border-[#E5D9CA] rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#4F3523]">Admin Login</h2>
            <p className="text-[#4F3523]/70 text-sm mt-2">Enter your credentials to access the dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2.5 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610] outline-none px-4 text-[#4F3523]"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610] outline-none px-4 pr-10 text-[#4F3523]"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F3523]/60 hover:text-[#4F3523]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#b58610] text-white rounded-xl hover:bg-[#a0740e] transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}