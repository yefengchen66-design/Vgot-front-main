import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import messages from '../locales/messages';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => { },
  t: (key, fallback) => fallback || key,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      // 1) Prefer the unified key 'lang'
      let storedLang = localStorage.getItem('lang');

      // 2) Backward-compat: if old 'language' exists (landing code), map it → vgot code
      if (!storedLang) {
        const oldLanding = localStorage.getItem('language'); // e.g. 'zh-CN', 'zh-TW', 'en', 'es'
        const mapToVgot = {
          'en': 'en',
          'zh-CN': 'zh',
          'zh-TW': 'zh-TW',
          'es': 'es'
        };
        if (oldLanding && mapToVgot[oldLanding]) {
          storedLang = mapToVgot[oldLanding];
        }
      }

      // 3) If still not found, default to English (requested behavior)
      if (!storedLang) {
        storedLang = 'en';
      }

      // 4) Sanitize unexpected values
  const allowed = new Set(['en', 'zh', 'zh-TW', 'es', 'ja']);
      if (!allowed.has(storedLang)) storedLang = 'en';

      return storedLang;
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lang', lang);

      // Map vgot language codes to landing page codes and sync (for legacy consumers)
      const landingLanguageMap = {
        'en': 'en',
        'zh': 'zh-CN',
        'zh-TW': 'zh-TW',
        'es': 'es',
        'ja': 'ja'
      };
      const landingLanguage = landingLanguageMap[lang] || 'en';
      localStorage.setItem('language', landingLanguage);

      // Notify listeners that rely on localStorage('language')
      window.dispatchEvent(new Event('languageChange'));
    } catch { }
  }, [lang]);

  const get = (obj, path) => {
    try {
      return path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);
    } catch { return undefined; }
  };

  const t = (key, fallback) => {
    const v = get(messages?.[lang], key);
    if (typeof v === 'string') return v;
    return fallback || key;
  };

  // Map vgot language codes to landing page codes
  const landingLanguageMap = {
    'en': 'en',
    'zh': 'zh-CN',
    'zh-TW': 'zh-TW',
    'es': 'es',
    'ja': 'ja'
  };

  const landingLanguage = landingLanguageMap[lang] || 'en';

  const value = useMemo(() => ({
    lang,
    language: landingLanguage, // Use landing language code for new components
    setLang,
    setLanguage: setLang,
    t,
  }), [lang, landingLanguage]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
