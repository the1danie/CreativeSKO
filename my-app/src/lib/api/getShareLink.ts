// Мок-функция генерации ссылки на скачивание книги
export async function getShareLink(bookId: string): Promise<string> {
    // небольшая задержка для реалистичности
    await new Promise(r => setTimeout(r, 300));
  
    // придуманный формат ссылки (можешь поменять под свой домен)
    return `https://qcc-sko.kz/books/${bookId}`;
  }
  