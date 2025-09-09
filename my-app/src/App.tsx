// App.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/header";
import BookGrid from "@components/book-grid";
import ReadBook from "@components/book-grid/read-book";
import { Routes, Route } from "react-router-dom";
import { useLibraryStore } from "@app/store/library.store";
import type { Book as UIBook } from "@components/book-grid/book-card/types"; // 👈 UI-Book тип
import { useTranslation } from "react-i18next";

const API_BASE = "https://libdjango.fm64.me/api/v1";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    filteredBooks,
    fetchBooks,
    page,
    total,
    setCategory,
    setAuthor,
  } = useLibraryStore(); // 👈 достаём setCategory и setAuthor
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("translation");

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Первичная загрузка
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchBooks(1, false); // загружаем первую страницу
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchBooks]);

  // 🔄 Маппим store-книги → UI-книги
  const mappedBooks: UIBook[] = useMemo(
    () =>
      filteredBooks.map((b) => ({
        id: String(b.id),
        title: b.title_ru || b.title_en || b.title_kz,
        author:
          b.author?.name_ru ||
          b.author?.name_en ||
          b.author?.name_kz ||
          "Неизвестный автор",
        imageUrl: b.cover_url,
        pdfUrl: `${API_BASE}/books/${b.id}/download`,
        streamUrl: `${API_BASE}/books/${b.id}/stream`,
      })),
    [filteredBooks]
  );

  // 🔎 Поиск
  const searchedBooks = useMemo(() => {
    if (!searchQuery.trim()) return mappedBooks;
    const query = searchQuery.toLowerCase();
    return mappedBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }, [searchQuery, mappedBooks]);

  // Подгрузка при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && filteredBooks.length < total) {
          setLoading(true);
          try {
            await fetchBooks(page + 1, true); // загружаем следующую страницу
          } finally {
            setLoading(false);
          }
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [page, total, loading, filteredBooks, fetchBooks]);

  return (
    <div className="min-h-screen text-foreground bg-section">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header
                onSearch={setSearchQuery}
                onSelectCategory={async (id) => {
                  setCategory(id);
                  await fetchBooks(1, false); // перезапрашиваем книги по категории
                }}
                onSelectAuthor={async (id) => {
                  setAuthor(id);
                  await fetchBooks(1, false); // перезапрашиваем книги по автору
                }}
              />
              <main className="pt-30">
                {loading && page === 1 ? (
                  <p className="text-center">{t('loading')}</p>
                ) : searchedBooks.length === 0 ? (
                  <p className="text-center text-gray-500 mt-10">
                    {t('noBooks')}
                  </p>
                ) : (
                  <>
                    <BookGrid books={searchedBooks} />
                    {/* Сторожок для IntersectionObserver */}
                    <div
                      ref={loaderRef}
                      className="h-10 flex justify-center items-center"
                    >
                      {loading && <p>{t('loading')}</p>}
                    </div>
                  </>
                )}
              </main>
            </>
          }
        />
        <Route
          path="/books/:id"
          element={
            <>
              <Header readbook={false} />
              <main>
                <ReadBook />
              </main>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
