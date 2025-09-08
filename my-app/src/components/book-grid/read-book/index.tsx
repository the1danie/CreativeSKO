import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const API_BASE = "https://libdjango.fm64.me/api/v1";

const ReadBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { title?: string } | null;

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = state?.title ?? `Книга #${id}`;

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/books/${id}/stream`, {
          headers: { Range: "bytes=0-" }, // 👈 важно для PDF
        });

        if (!res.ok) throw new Error("Ошибка загрузки книги");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        setError("Не удалось загрузить книгу");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPdf();
    }
  }, [id]);

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

      {loading && (
        <div className="border rounded-md p-6 text-gray-600">Загрузка...</div>
      )}

      {error && (
        <div className="border rounded-md p-6 text-red-600">{error}</div>
      )}

      {!loading && !error && pdfUrl && (
        <div className="border mt-10 rounded-md overflow-hidden h-[85vh]">
          <iframe src={pdfUrl} title={title} className="w-full h-full" />
        </div>
      )}
    </div>
  );
};

export default ReadBook;
