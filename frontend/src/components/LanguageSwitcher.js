import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

// Map between landing page codes and vgot codes
const landingToVgot = {
  'en': 'en',
  'zh-CN': 'zh',
  'zh-TW': 'zh-TW',
  'es': 'es',
  'ja': 'ja'
};

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh-CN", name: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", name: "繁體中文", flag: "🇹🇼" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" }
];

export function LanguageSwitcher({ dropUp = false }) {
  const { language, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find((lang) => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (landingCode) => {
    const vgotCode = landingToVgot[landingCode] || 'en';
    setLang(vgotCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="text-[#9ca3af] hover:text-white hover:bg-white/5 text-sm gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
      </Button>
      {isOpen && (
        <div className={`absolute right-0 w-48 bg-[#0a0e1a] border border-white/10 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden z-50 ${dropUp ? 'bottom-full mb-2' : 'mt-2'}`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="w-full text-left px-4 py-3 text-[#9ca3af] hover:text-white hover:bg-white/5 cursor-pointer flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="text-sm">{lang.name}</span>
              </span>
              {language === lang.code && <Check className="w-4 h-4 text-[#a855f7]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
