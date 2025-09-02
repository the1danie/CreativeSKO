import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';

// Настройка воркера для Vite
(pdfjsLib as typeof pdfjsLib & { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Рендерит страницу PDF в dataURL (PNG).
 * @param url       путь/URL к PDF
 * @param pageNum   номер страницы (1 = первая)
 * @param targetW   желаемая ширина превью (px)
 */
export async function getPdfCoverDataUrl(url: string, pageNum = 1, targetW = 512): Promise<string> {
  const pdf = await pdfjsLib.getDocument(url).promise;
  const page = await pdf.getPage(pageNum);

  const viewport = page.getViewport({ scale: 1 });
  const scale = targetW / viewport.width;
  const scaled = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  canvas.width = Math.floor(scaled.width);
  canvas.height = Math.floor(scaled.height);

  await page.render({ canvas, canvasContext: ctx, viewport: scaled }).promise;

  const dataUrl = canvas.toDataURL('image/png');
  canvas.width = 0; canvas.height = 0; // освобождаем
  return dataUrl;
}
