'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

export default function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Detect language: prefer localStorage, then browser language, fallback to 'es'
    const saved = localStorage.getItem('i18nextLng');
    const browserLang = navigator.language.split('-')[0];
    const lang = saved ?? (browserLang === 'en' ? 'en' : 'es');
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
