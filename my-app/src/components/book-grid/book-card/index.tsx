import React from "react";
import type { Book } from "./types";
import ModalBook from "../modal-book";

type Props = { book: Book };

const BookCard: React.FC<Props> = ({ book }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        className="w-[250px] select-none cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="relative aspect-[4/5] rounded-md overflow-hidden">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="absolute inset-0 w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-gray-400 text-xs p-3 text-center z-10">
              Нет обложки
            </div>
          )}
        </div>

        <div className="mt-3 text-center">
          <p
            className="text-sm font-semibold text-gray-900 truncate"
            title={book.author}
          >
            {book.author}
          </p>
          <p
            className="text-sm text-gray-700 leading-snug line-clamp-2 break-words"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
            title={book.title}
          >
            {book.title}
          </p>
        </div>
      </div>

      {/* Модалка просто показывает PDF */}
      <ModalBook
        book={book}
        cover={book.imageUrl ?? null}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default BookCard;
