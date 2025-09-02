import React from 'react';
import { Radio, ConfigProvider, type RadioChangeEvent } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import './radio-orange.css'; // 👈 CSS подключаем отдельно
import { useTranslation } from 'react-i18next';

const options: CheckboxGroupProps<string>['options'] = [
  { label: 'RU', value: 'RU' },
  { label: 'KZ', value: 'KZ' },
  { label: 'EN', value: 'EN' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (e: RadioChangeEvent) => {
    i18n.changeLanguage(e.target.value);
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
      defaultValue={currentLanguage}
      optionType="button"
      buttonStyle="outline"
      onChange={handleLanguageChange}
    />
  </ConfigProvider>
  );
};

export default LanguageSwitcher;
