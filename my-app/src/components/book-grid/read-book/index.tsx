import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ReadBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { title?: string; pdfUrl?: string } | null;
  const title = state?.title ?? `Книга #${id}`;
  const pdfUrl = state?.pdfUrl;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <button
          className="text-blue-600 underline"
          onClick={() => navigate(-1)}
        >
          Назад
        </button>
      </div>

      {pdfUrl ? (
        <div className="border mt-10 rounded-md overflow-hidden h-[85vh]">
          <iframe src={pdfUrl} title={title} className="w-full h-full" />
        </div>
      ) : (
        <div className="border rounded-md p-6 text-gray-600">
          Файл книги не передан. ID: {id}
        </div>
      )}
    </div>
  );
};

export default ReadBook;
