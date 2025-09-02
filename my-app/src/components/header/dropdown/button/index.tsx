import React from 'react';
import { ConfigProvider, Dropdown, Button, Space } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';

const items = [
  { label: 'Профиль', key: '1', icon: <UserOutlined /> },
  { label: 'Настройки', key: '2', icon: <UserOutlined /> },
  { label: 'Выход', key: '3', danger: true },
];

const menuProps = {
  items,
  onClick: (e: any) => console.log('menu click', e),
};

const DropdownButton: React.FC<{title: string}> = ({title}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#E9531E',
          colorPrimaryHover: '#cc4212',
          colorPrimaryActive: '#a2320d',
        },
      }}
    >
      <Space>
        <Dropdown menu={menuProps} trigger={["click"]}>
          <Button size='large'
            type="default" className="orange-outlined">
            <Space>
              {title}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </ConfigProvider>
  );
};

export default DropdownButton;
