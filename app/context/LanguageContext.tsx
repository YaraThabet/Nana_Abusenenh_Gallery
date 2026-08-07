"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import enTranslations from "../locales/en.json";
import arTranslations from "../locales/ar.json";

// أنواع اللغات
type Language = "en" | "ar";

// شكل البيانات التي سيقدمها Context
interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// إنشاء Context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// ملفات الترجمة
const translations = {
  en: enTranslations,
  ar: arTranslations,
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // اللغة الافتراضية
  const [language, setLanguage] = useState<Language>("ar");

  // جلب اللغة المحفوظة
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;

    if (savedLanguage === "ar" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    } else {
      localStorage.setItem("language", "ar");
    }
  }, []);

  // عند تغيير اللغة
  useEffect(() => {
    localStorage.setItem("language", language);

    // اتجاه الصفحة
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = language;
  }, [language]);

  // تبديل اللغة
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"));
  };

  // دالة الترجمة
  const t = (key: string): string => {
    const keys = key.split(".");

    let value: any = translations[language];

    for (const item of keys) {
      if (value && value[item]) {
        value = value[item];
      } else {
        return key;
      }
    }

    return value;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};
