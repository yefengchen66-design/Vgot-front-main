import React from "react";
import { Button } from "./ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import logoImage from "../assets/logo.png";

export function Header({ onLoginClick }) {
  const { language } = useLanguage();
  const t = translations[language]?.nav || translations['en'].nav;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#020617]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-28 py-4">
          {/* Logo */}
          <a href="/" className="flex items-center" onClick={() => window.scrollTo(0, 0)}>
            <img src={logoImage} alt="VGOT" className="h-24 w-auto object-contain" />
          </a>

          {/* Navigation - Center Aligned */}
          {/* Navigation - Center Aligned */}
          <nav className={`hidden lg:flex items-center gap-10 absolute transform -translate-x-1/2 ${language === 'zh-CN' || language === 'zh-TW'
              ? 'left-1/2'
              : language === 'es'
                ? 'left-[42%]'
                : 'left-[46%]'
            }`}>
            <a href="/" className="text-[#9ca3af] hover:text-white transition-colors text-sm" onClick={() => window.scrollTo(0, 0)}>
              {t.home}
            </a>
            <a href="/#features" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
              {t.features}
            </a>
            <a href="/#pricing" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
              {t.pricing}
            </a>
            <a href="/#partner" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
              {t.partner}
            </a>
            <a href="/help-center" className="text-[#9ca3af] hover:text-white transition-colors text-sm">
              {t.helpCenter}
            </a>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/5 text-sm"
              onClick={onLoginClick}
            >
              {t.login}
            </Button>
            <Button
              className="bg-gradient-to-r from-[#4f46e5] to-[#ec4899] hover:from-[#4338ca] hover:to-[#db2777] text-white text-sm px-6 h-8 rounded-full shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
              onClick={onLoginClick}
            >
              {t.startFree}
            </Button>

          </div>
        </div>
      </div>
    </header>
  );
}
