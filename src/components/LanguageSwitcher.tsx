'use client';

import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const active = 'px-2.5 py-1 text-xs font-bold rounded bg-blue-600 text-white';
  const inactive =
    'px-2.5 py-1 text-xs font-bold rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors';

  return (
    <div className="flex gap-1" aria-label="Language selector">
      <button
        onClick={() => changeLanguage('es')}
        className={i18n.language === 'es' ? active : inactive}
        title="Español"
      >
        {t('language.es')}
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? active : inactive}
        title="English"
      >
        {t('language.en')}
      </button>
    </div>
  );
}
