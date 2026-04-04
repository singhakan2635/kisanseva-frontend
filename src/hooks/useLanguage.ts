import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const LANG_KEY = 'kisanseva_lang';

export type SupportedLanguage = 'en' | 'hi';

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = (i18n.language?.substring(0, 2) || 'en') as SupportedLanguage;

  const setLanguage = useCallback(
    (lang: SupportedLanguage) => {
      i18n.changeLanguage(lang);
      localStorage.setItem(LANG_KEY, lang);
    },
    [i18n]
  );

  const toggleLanguage = useCallback(() => {
    const next = currentLanguage === 'en' ? 'hi' : 'en';
    setLanguage(next);
  }, [currentLanguage, setLanguage]);

  return {
    currentLanguage,
    setLanguage,
    toggleLanguage,
    isEnglish: currentLanguage === 'en',
    isHindi: currentLanguage === 'hi',
  };
}
