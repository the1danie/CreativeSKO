import React from 'react';
import { ConfigProvider, Input } from 'antd';

const { Search } = Input;

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleSearch = (value: string) => {
    if (onSearch) {
      onSearch(value);
    }
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
      <Search
        placeholder="Введите название"
        allowClear 
        enterButton="Найти"
        size="large"
        style={{ width: '100%' }}   // растягиваем на всю ширину контейнера
        onSearch={handleSearch}
      />
    </ConfigProvider>
  );
};

export default SearchBar;
