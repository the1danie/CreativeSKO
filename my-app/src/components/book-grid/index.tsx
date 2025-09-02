import React from 'react';
import BookCard from './book-card';
import type { Book } from './book-card/types';

type Props = { books: Book[] };

const BookGrid: React.FC<Props> = ({ books }) => {
  return (
    <div className="grid grid-cols-5 gap-4 justify-items-center">
      {books.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
};

export default BookGrid;
