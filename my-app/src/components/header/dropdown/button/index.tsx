import React from "react";
import { ConfigProvider, Dropdown, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

type Props = {
  title: string;
  items: { key: string; label: string }[];
  selectedLabel?: string; // 👈 новое свойство
  onSelect?: (key: string, label: string) => void;
};

const DropdownButton: React.FC<Props> = ({ title, items, selectedLabel, onSelect }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#E9531E",
          colorPrimaryHover: "#cc4212",
          colorPrimaryActive: "#a2320d",
        },
      }}
    >
      <Space>
        <Dropdown
          menu={{
            items,
            onClick: (info) => {
              const selected = items.find((i) => i.key === info.key);
              if (onSelect && selected) onSelect(info.key, selected.label);
            },
          }}
          trigger={["click"]}
        >
          <Button size="large" type="default" className="orange-outlined">
            <Space>
              {selectedLabel || title}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </ConfigProvider>
  );
};

export default DropdownButton;
