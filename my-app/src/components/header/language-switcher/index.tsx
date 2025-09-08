import React, { useEffect } from 'react';
import { Radio, ConfigProvider, type RadioChangeEvent } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import './radio-orange.css'; // 👈 CSS подключаем отдельно
import { useTranslation } from 'react-i18next';
import { useLanguageStore, type Language } from '@app/store/language.store';

const options: CheckboxGroupProps<string>['options'] = [
  { label: 'RU', value: 'ru' },
  { label: 'KZ', value: 'kz' },
  { label: 'EN', value: 'en' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation('translation');
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageChange = (e: RadioChangeEvent) => {
    const next = e.target.value as Language;
    i18n.changeLanguage(next);
    setLanguage(next);
  };

  // Синхронизация стора с i18n (после перезагрузки страницы и при смене языка извне)
  useEffect(() => {
    const normalize = (lng?: string): Language => {
      const v = (lng || "").toLowerCase();
      if (v.startsWith("ru")) return "ru";
      if (v.startsWith("kz")) return "kz";
      return "en";
    };
    

    const initial = normalize(i18n.resolvedLanguage || i18n.language);
    if (language !== initial) {
      setLanguage(initial);
    }

    const onChanged = (lng: string) => {
      const next = normalize(lng);
      setLanguage(next);
    };

    i18n.on('languageChanged', onChanged);
    return () => {
      i18n.off('languageChanged', onChanged);
    };
  }, [i18n, language, setLanguage]);

  return (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#E9531E',        // основной оранжевый
        colorPrimaryHover: '#cc4212',   // hover/active чуть темнее
        colorPrimaryActive: '#a2320d',
      },
    }}
  >
    <Radio.Group
      className="orange-radio"
      block
      size='large'
      options={options}
      value={language}
      optionType="button"
      buttonStyle="outline"
      onChange={handleLanguageChange}
    />
  </ConfigProvider>
  );
};

export default LanguageSwitcher;
