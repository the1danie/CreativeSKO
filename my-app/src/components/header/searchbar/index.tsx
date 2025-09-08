import React, { useEffect, useState, useRef } from "react";
import { ConfigProvider, Input } from "antd";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./keyboard.css"; // подключим стили
import { useTranslation } from "react-i18next";
import { useSearchStore } from "@app/store/search.store";

const { Search } = Input;

type KeyboardLayout = {
  default: string[];
  shift: string[];
};

const layouts: Record<"en" | "ru" | "kz", KeyboardLayout> = {
  en: {
    default: [
      "q w e r t y u i o p",
      "a s d f g h j k l {enter}",
      "{shift} z x c v b n m {bksp}",
      "{lang} {space}",
    ],
    shift: [
      "Q W E R T Y U I O P",
      "A S D F G H J K L {enter}",
      "{shift} Z X C V B N M {bksp}",
      "{lang} {space}",
    ],
  },
  ru: {
    default: [
      "й ц у к е н г ш щ з х ъ",
      "ф ы в а п р о л д ж э {enter}",
      "{shift} я ч с м и т ь б ю . {bksp}",
      "{lang} {space}",
    ],
    shift: [
      "Й Ц У К Е Н Г Ш Щ З Х Ъ",
      "Ф Ы В А П Р О Л Д Ж Э {enter}",
      "{shift} Я Ч С М И Т Ь Б Ю , {bksp}",
      "{lang} {space}",
    ],
  },
  kz: {
    default: [
      "ә ғ қ ө ү ұ і һ е н г ш щ з х ъ",
      "ф ы в а п р о л д ж э {enter}",
      "{shift} я ч с м и т ь б ю . {bksp}",
      "{lang} {space}",
    ],
    shift: [
      "Ә Ғ Қ Ө Ү Ұ І Һ Е Н Г Ш Щ З Х Ъ",
      "Ф Ы В А П Р О Л Д Ж Э {enter}",
      "{shift} Я Ч С М И Т Ь Б Ю , {bksp}",
      "{lang} {space}",
    ],
  },
};

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchWithKeyboard: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { t, i18n } = useTranslation('translation');
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const [layoutName, setLayoutName] = useState<"default" | "shift">("default");
  const [currentLang, setCurrentLang] = useState<"en" | "ru" | "kz">((() => {
    const v = (i18n.resolvedLanguage || i18n.language || "en").toLowerCase();
    if (v.startsWith("ru")) return "ru";
    if (v.startsWith("kz")) return "kz";
    return "en";
  })());
  const [showKeyboard, setShowKeyboard] = useState(false);
  const keyboardRef = useRef<import("simple-keyboard").default | null>(null);

  // Следим за сменой языка в i18n и обновляем раскладку клавиатуры
  useEffect(() => {
    const normalize = (lng?: string): "en" | "ru" | "kz" => {
      const v = (lng || "").toLowerCase();
      if (v.startsWith("ru")) return "ru";
      if (v.startsWith("kz")) return "kz";
      return "en";
    };
    const initial = normalize(i18n.resolvedLanguage || i18n.language);
    if (initial !== currentLang) {
      setCurrentLang(initial);
    }
    const onChanged = (lng: string) => setCurrentLang(normalize(lng));
    i18n.on("languageChanged", onChanged);
    return () => {
      i18n.off("languageChanged", onChanged);
    };
  }, [i18n, currentLang]);

  const handleSearch = (val: string) => {
    if (onSearch) {
      onSearch(val);
    }
    setShowKeyboard(false);
  };

  const onChange = (val: string) => {
    setQuery(val);
  };

  const handleKeyPress = (button: string) => {
    if (button === "{shift}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
    if (button === "{lang}") {
      const next = currentLang === "en" ? "ru" : currentLang === "ru" ? "kz" : "en";
      // Меняем язык всего приложения; currentLang обновится по событию languageChanged
      i18n.changeLanguage(next);
      setLayoutName("default");
    }
    if (button === "{enter}") {
      handleSearch(query);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#E9531E",
            colorPrimaryHover: "#cc4212",
            colorPrimaryActive: "#a2320d",
          },
        }}
      >
        <Search
          value={query}
          placeholder={t('input')}
          allowClear
          enterButton={t('search')}
          size="large"
          style={{ width: "100%" }}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={handleSearch}
          onFocus={() => setShowKeyboard(true)}
        />
      </ConfigProvider>

      {showKeyboard && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: "#fff",
            boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
            padding: "8px 8px 12px",
          }}
        >
          <Keyboard
            keyboardRef={(r) => (keyboardRef.current = r)}
            layout={layouts[currentLang]}
            layoutName={layoutName}
            onChange={onChange}
            onKeyPress={handleKeyPress}
            display={{
              "{bksp}": "⌫",
              "{shift}": "⇧",
              "{space}": " ",
              "{lang}": "🌐",
              "{enter}": "⏎",
            }}
            buttonTheme={[
              { class: "hg-space", buttons: "{space}" },
              { class: "hg-shift", buttons: "{shift}" },
              { class: "hg-langц", buttons: "{lang}" },
              { class: "hg-enter", buttons: "{enter}" },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default SearchWithKeyboard;
