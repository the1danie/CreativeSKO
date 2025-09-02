import React from 'react';
import { Radio, ConfigProvider, type RadioChangeEvent } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import './radio-orange.css'; // 👈 CSS подключаем отдельно
import { useTranslation } from 'react-i18next';
import { useLanguageStore, type Language } from '@app/store/language.store';

const options: CheckboxGroupProps<string>['options'] = [
  { label: 'RU', value: 'RU' },
  { label: 'KZ', value: 'KZ' },
  { label: 'EN', value: 'EN' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation('translation');
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageChange = (e: RadioChangeEvent) => {
    i18n.changeLanguage(e.target.value as Language);
    setLanguage(e.target.value as Language);
  };

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
