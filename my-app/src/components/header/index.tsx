// Header.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./searchbar";
import LanguageSwitcher from "./language-switcher";
import DropdownButton from "./dropdown/button";
import { useTranslation } from "react-i18next";
import { useLibraryStore } from "@app/store/library.store";

type Props = {
    readbook?: boolean;
    title?: string;
    onSearch?: (query: string) => void;
    onSelectCategory?: (id: string | null) => void;
    onSelectAuthor?: (id: string | null) => void; // 👈 заменил
};

const Header: React.FC<Props> = ({ readbook = true, title, onSearch, onSelectAuthor, onSelectCategory }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { title?: string } | null;
    const readingTitle = title ?? state?.title ?? "";
    const { t, i18n } = useTranslation("translation");

    const { categories, authors, fetchCategories, fetchAuthors } = useLibraryStore();

    const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string>();
    const [selectedAuthorLabel, setSelectedAuthorLabel] = useState<string>(); // 👈 заменил


    useEffect(() => {
        fetchCategories();
        fetchAuthors();
    }, [fetchCategories, fetchAuthors]);

    const currentLang = i18n.language.startsWith("ru")
        ? "ru"
        : i18n.language.startsWith("kz")
            ? "kz"
            : "en";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm w-full">
            <div className="px-4 sm:px-6 lg:px-8">
                <div
                    className={
                        "flex items-center " +
                        (readbook ? "justify-between" : "justify-between") +
                        " h-20 w-full"
                    }
                >
                    {readbook ? (
                        <>
                            <div className="flex items-center gap-2">
                                <LanguageSwitcher />
                                <DropdownButton
                                    title={t("categories")}
                                    items={[
                                        { key: "all", label: t("allCategories") }, // 👈 добавил
                                        ...(categories ?? []).map((c) => ({
                                            key: String(c.id),
                                            label: c[`name_${currentLang}` as keyof typeof c] as string,
                                        })),
                                    ]}
                                    selectedLabel={selectedCategoryLabel}
                                    onSelect={(id, label) => {
                                        if (id === "all") {
                                            onSelectCategory?.(null); // сброс
                                            setSelectedCategoryLabel(undefined);
                                        } else {
                                            onSelectCategory?.(id);
                                            setSelectedCategoryLabel(label);
                                        }
                                    }}
                                />

                                <DropdownButton
                                    title={t("authors")}
                                    items={[
                                        { key: "all", label: t("allAuthors") },
                                        ...(authors ?? []).map((c) => ({
                                            key: String(c.id),
                                            label: c[`name_${currentLang}` as keyof typeof c] as string,
                                        })),
                                    ]}
                                    selectedLabel={selectedAuthorLabel}
                                    onSelect={(id, label) => {
                                        if (id === "all") {
                                            onSelectAuthor?.(null);
                                            setSelectedAuthorLabel(undefined);
                                        } else {
                                            onSelectAuthor?.(id);
                                            setSelectedAuthorLabel(label);
                                        }
                                    }}
                                />

                            </div>
                            <div className="flex-1 px-4">
                                <SearchBar onSearch={onSearch} />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                aria-label="Назад"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            {readingTitle && (
                                <h1 className="text-lg font-semibold uppercase tracking-wide">
                                    {readingTitle}
                                </h1>
                            )}
                        </div>
                    )}

                    <div className="shrink-0 flex items-center">
                        <img
                            src="/logo.svg"
                            alt="QCC x SKO HUB"
                            className="h-14 w-auto"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
