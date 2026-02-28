import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/i18n/translations";

type TranslationStrings = { [K in keyof typeof translations["en"]]: string };

type LanguageContextType = {
  lang: Language;
  t: TranslationStrings;
  toggleLanguage: () => void;
  dir: "rtl" | "ltr";
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("nafeir-lang") as Language) || "en";
  });

  const toggleLanguage = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  useEffect(() => {
    localStorage.setItem("nafeir-lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{ lang, t: translations[lang], toggleLanguage, dir: lang === "ar" ? "rtl" : "ltr" }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
