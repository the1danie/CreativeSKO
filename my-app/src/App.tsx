import { useState, useMemo } from 'react';
import Header from './components/header'
import type { Book } from '@components/book-grid/book-card/types';
import BookGrid from '@components/book-grid';
import ReadBook from '@components/book-grid/read-book';
import { Routes, Route } from 'react-router-dom';

const demoBooks: Book[] = [
  {
    id: '1',
    title: 'История джанго',
    author: 'Абай Кунанбаев',
    pdfUrl: '/books/test.pdf',
  },
  {
    id: '2',
    title: 'Стихотворения и поэмы',
    author: 'Абай Кунанбаев',
    pdfUrl: '/books/test2.pdf',
  },
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация книг по поисковому запросу
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) {
      return demoBooks;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return demoBooks.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="min-h-screen text-foreground bg-section">
      <Routes>
        <Route
          path="/"
          element={(
            <>
              <Header onSearch={handleSearch} />
              <main className="pt-30">
                <BookGrid books={filteredBooks} />
              </main>
            </>
          )}
        />
        <Route
          path="/books/:id"
          element={(
            <>
              <Header readbook={false}/>
              <main>
                <ReadBook />
              </main>
            </>
          )}
        />
      </Routes>
    </div>
  )
}

export default App
