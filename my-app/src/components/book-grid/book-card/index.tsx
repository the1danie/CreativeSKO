import React from 'react';
import { getPdfCoverDataUrl } from './pdf-cover';
import type { Book } from './types';
import ModalBook from '../modal-book';

type Props = { book: Book };

const BookCard: React.FC<Props> = ({ book }) => {
  const [cover, setCover] = React.useState<string | null>(book.imageUrl ?? null);
  const [loading, setLoading] = React.useState<boolean>(!!book.pdfUrl);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function renderPdf() {
      if (!book.pdfUrl || cover) return;
      setLoading(true);
      try {
        const dataUrl = await getPdfCoverDataUrl(book.pdfUrl, 1, 512);
        if (!cancelled) setCover(dataUrl);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'PDF preview error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    renderPdf();
    return () => { cancelled = true; };
  }, [book.pdfUrl, cover]);

  return (
    <>
      <div
        className="w-[250px] select-none cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="relative aspect-[4/5] rounded-md overflow-hidden">
          {loading && (
            <div className="absolute inset-0 grid place-items-center text-sm">
              рендер…
            </div>
          )}
          {cover && (
            <img
              src={cover}
              alt={book.title}
              className="absolute inset-0 w-full h-full object-cover rounded-md"
              style={{
                display: 'block',
                maxWidth: 'none',
                width: '120%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                marginLeft: '-10%'
              }}
            />
          )}
          {!loading && !cover && (
            <div className="absolute inset-0 grid place-items-center text-gray-400 text-xs p-3 text-center z-10">
              {error ? 'Не удалось загрузить обложку' : 'Нет обложки'}
            </div>
          )}
        </div>

        <div className="mt-3 text-center">
          <p className="text-sm font-semibold text-gray-900 truncate" title={book.author}>
            {book.author}
          </p>
          <p
            className="text-sm text-gray-700 leading-snug line-clamp-2 break-words"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
            title={book.title}
          >
            {book.title}
          </p>
        </div>
      </div>

      <ModalBook book={book} cover={cover} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default BookCard;
