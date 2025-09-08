export type Book = {
    id: string;
    title: string;
    author: string;
    imageUrl?: string; // jpg/png/svg
    pdfUrl?: string;   // путь к pdf (из public или URL)
    streamUrl?: string;
  };
  