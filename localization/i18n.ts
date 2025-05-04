import { useCallback } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import en from './translations/en';
import es from './translations/es';

const translations = {
  en,
  es,
};

export type TranslationKey = keyof typeof en;
type NestedKeys<T> = T extends object 
  ? { [K in keyof T]: K extends string 
    ? T[K] extends object
      ? `${K}.${NestedKeys<T[K]>}`
      : K
    : never 
  }[keyof T]
  : never;

type PathsToStringProps = NestedKeys<typeof en>;

export const useTranslation = () => {
  const { language } = useLanguageStore();

  const t = useCallback((key: PathsToStringProps): string => {
    const keys = key.split('.');
    let translation: any = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      if (translation[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      translation = translation[k];
    }
    
    return translation;
  }, [language]);

  return { t, language };
};
