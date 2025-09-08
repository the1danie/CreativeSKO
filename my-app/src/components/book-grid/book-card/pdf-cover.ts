import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';

// Настройка воркера для Vite
(pdfjsLib as typeof pdfjsLib & { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Рендерит страницу PDF в dataURL (PNG).
 * @param url       путь/URL к PDF (может быть stream API)
 * @param pageNum   номер страницы (1 = первая)
 * @param targetW   желаемая ширина превью (px)
 */
export async function getPdfCoverDataUrl(
  url: string,
  pageNum = 1,
  targetW = 512
): Promise<string> {
  let src: string | ArrayBuffer = url;

  // Если это API-эндпоинт, который скачивает PDF, забираем через fetch
  if (url.startsWith('http')) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Ошибка загрузки PDF: ${res.status}`);
    const blob = await res.blob();
    src = await blob.arrayBuffer();
  }

  // Загружаем PDF
  const pdf = await pdfjsLib.getDocument({ data: src }).promise;
  const page = await pdf.getPage(pageNum);

  // Масштабирование под targetW
  const viewport = page.getViewport({ scale: 1 });
  const scale = targetW / viewport.width;
  const scaled = page.getViewport({ scale });

  // Канвас
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  canvas.width = Math.floor(scaled.width);
  canvas.height = Math.floor(scaled.height);

  await page.render({
    canvas,
    canvasContext: ctx,
    viewport: scaled,
  }).promise;

  // Превращаем в base64
  const dataUrl = canvas.toDataURL('image/png');
  canvas.width = 0;
  canvas.height = 0; // освобождаем память
  return dataUrl;
}
