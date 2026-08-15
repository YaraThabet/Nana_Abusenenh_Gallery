"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const CheckoutPage = () => {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [formData, setFormData] = useState({
    nameAr: "", // ✅ الاسم بالعربية
    nameEn: "", // ✅ الاسم بالإنجليزية
    email: "",
    phone: "",
    address: "",
  });

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: null, message: "" });

    const orderData = {
      nameAr: formData.nameAr,
      nameEn: formData.nameEn,
      name: formData.nameAr || formData.nameEn, // للتوافق مع الخلفية
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url,
      })),
      total_price: totalPrice,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        setNotification({
          type: "success",
          message:
            language === "ar"
              ? "✅ تم تقديم الطلب بنجاح! سنتواصل معك قريباً."
              : "✅ Order placed successfully! We will contact you soon.",
        });
      } else {
        setNotification({
          type: "error",
          message:
            result.error ||
            (language === "ar"
              ? "حدث خطأ ما. يرجى المحاولة مرة أخرى."
              : "Something went wrong. Please try again."),
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setNotification({
        type: "error",
        message:
          language === "ar"
            ? "خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى."
            : "Network error. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ إذا كانت السلة فارغة
  if (cart.length === 0 && notification.type !== "success") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#F7F3EC]"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <h2 className="text-2xl font-bold mb-4 text-[#4F3523]">
          {t("checkout.emptyCart")}
        </h2>
        <Link href="/shop" className="text-[#b58610] hover:underline">
          {t("checkout.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F7F3EC] px-4 sm:px-8 lg:px-23 pt-24 md:pt-28 pb-16"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* ✅ زر العودة */}
      <button
        onClick={() => router.back()}
        className={`flex items-center gap-2 text-[#4F3523]/60 hover:text-[#b58610] transition-colors duration-300 mb-6 ${
          language === "ar" ? "flex-row-reverse" : ""
        }`}
      >
        <ArrowLeft
          className={`w-5 h-5 ${language === "ar" ? "rotate-180" : ""}`}
        />
        {t("checkout.back")}
      </button>

      <h1 className="text-3xl font-bold font-['Cormorant_Garamond'] mb-8 text-[#4F3523]">
        {t("checkout.title")}
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ✅ نموذج الدفع */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ✅ حقل الاسم بالعربية */}
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-1">
                {t("checkout.fullNameAr")} *
              </label>
              <input
                type="text"
                name="nameAr"
                required
                value={formData.nameAr}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all text-[#4F3523] placeholder:text-[#4F3523]/50"
                placeholder={t("checkout.fullNameArPlaceholder")}
                dir="rtl"
              />
            </div>

            {/* ✅ حقل الاسم بالإنجليزية */}
            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-1">
                {t("checkout.fullNameEn")} *
              </label>
              <input
                type="text"
                name="nameEn"
                required
                value={formData.nameEn}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all text-[#4F3523] placeholder:text-[#4F3523]/50"
                placeholder={t("checkout.fullNameEnPlaceholder")}
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-1">
                {t("checkout.email")} *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all text-[#4F3523] placeholder:text-[#4F3523]/50"
                placeholder="john@example.com"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-1">
                {t("checkout.phone")} *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all text-[#4F3523] placeholder:text-[#4F3523]/50"
                placeholder={
                  language === "ar" ? "+970 59 123 4567" : "+970 59 123 4567"
                }
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4F3523]/80 mb-1">
                {t("checkout.address")} *
              </label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-[#E5D9CA] bg-white/50 rounded-xl focus:ring-2 focus:ring-[#b58610]/20 focus:border-[#b58610] outline-none transition-all resize-none text-[#4F3523] placeholder:text-[#4F3523]/50"
                placeholder={
                  language === "ar"
                    ? "رام الله، فلسطين"
                    : "123 Main St, City, Country"
                }
                dir={language === "ar" ? "rtl" : "ltr"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-medium transition-colors duration-300 ${
                loading
                  ? "bg-[#b58610]/50 cursor-not-allowed text-white"
                  : "bg-[#b58610] hover:bg-[#a0740e] text-white shadow-sm hover:shadow-md"
              }`}
            >
              {loading ? t("checkout.processing") : t("checkout.placeOrder")}
            </button>
          </form>
        </div>

        {/* ✅ ملخص الطلب */}
        <div className="lg:w-1/3 bg-[#FAF8F5] border border-[#E5D9CA] shadow-[#4F3523]/10 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-[#4F3523]">
            {t("checkout.orderSummary")}
          </h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-[#4F3523]/80"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E5D9CA] mt-4 pt-4">
            <div className="flex justify-between font-semibold text-lg text-[#4F3523]">
              <span>{t("checkout.total")}</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ الإشعار */}
      {notification.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#4F3523]/80 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] border border-[#E5D9CA] rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            {notification.type === "success" ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            )}
            <h3 className="text-xl font-semibold mb-2 text-[#4F3523]">
              {notification.type === "success"
                ? t("checkout.orderPlaced")
                : t("checkout.error")}
            </h3>
            <p className="text-[#4F3523]/70 text-sm mb-6">
              {notification.message}
            </p>
            <button
              onClick={() => {
                clearCart();
                setNotification({ type: null, message: "" });
                router.push("/shop");
              }}
              className="px-6 py-2 bg-[#b58610] text-white rounded-lg hover:bg-[#a0740e] transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              {notification.type === "success"
                ? t("checkout.continueShopping")
                : t("checkout.tryAgain")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
