// App.tsx
import { useEffect, useMemo, useState } from "react";
import Header from "./components/header";
import BookGrid from "@components/book-grid";
import ReadBook from "@components/book-grid/read-book";
import { Routes, Route } from "react-router-dom";
import { useLibraryStore } from "@app/store/library.store";
import type { Book as UIBook } from "@components/book-grid/book-card/types"; // 👈 UI-Book тип

const API_BASE = "https://libdjango.fm64.me/api/v1";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { filteredBooks, fetchBooks, filterBooks } = useLibraryStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchBooks();
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
        title: b.title_ru || b.title_en || b.title_kz, // 👈 делаем единое поле title
        author: b.author?.name_ru || b.author?.name_en || b.author?.name_kz || "Неизвестный автор",
        imageUrl: b.cover_url,
        pdfUrl: `${API_BASE}/books/${b.id}/download`,
        streamUrl: `${API_BASE}/books/${b.id}/stream`,
      })),
    [filteredBooks]
  );

  // 🔎 Поиск по mappedBooks
  const searchedBooks = useMemo(() => {
    if (!searchQuery.trim()) return mappedBooks;
    const query = searchQuery.toLowerCase();
    return mappedBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }, [searchQuery, mappedBooks]);

  return (
    <div className="min-h-screen text-foreground bg-section">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header
                onSearch={setSearchQuery}
                onSelectCategory={(id) => filterBooks(id, null)}
                onSelectCatalog={(id) => filterBooks(null, id)}
              />
              <main className="pt-30">
                {loading ? (
                  <p className="text-center">Загрузка...</p>
                ) : searchedBooks.length === 0 ? (
                  <p className="text-center text-gray-500 mt-10">
                    Книг не найдено
                  </p>
                ) : (
                  <BookGrid books={searchedBooks} />
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
