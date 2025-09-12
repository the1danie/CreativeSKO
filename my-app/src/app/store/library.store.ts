// store/library.store.ts
import { create } from "zustand";
import axios from "axios";

type Category = { id: number; name_en: string; name_ru: string; name_kz: string };
type Author = {
  id: number;
  name_en: string;
  name_ru: string;
  name_kz: string;
  count?: number;
};
type Book = {
  id: number;
  title_en: string;
  title_ru: string;
  title_kz: string;
  category: Category;
  catalog_id: number | null;
  cover_url: string;
  year: number;
  author: Author;
};

type LibraryStore = {
  books: Book[];
  filteredBooks: Book[];
  categories: Category[];
  authors: Author[];
  page: number;
  limit: number;
  total: number;
  selectedCategoryId: string | null;
  selectedCatalogId: string | null;
  selectedAuthorId: string | null;
  fetchBooks: (page?: number, append?: boolean) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchAuthors: () => Promise<void>;
  setCategory: (id: string | null) => void;
  setCatalog: (id: string | null) => void;
  setAuthor: (id: string | null) => void;
};

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  books: [],
  filteredBooks: [],
  categories: [],
  authors: [],
  page: 1,
  limit: 20,
  total: 0,
  selectedCategoryId: null,
  selectedCatalogId: null,
  selectedAuthorId: null,

  fetchBooks: async (page = 1, append = false) => {
    const { limit, selectedCategoryId, selectedCatalogId, selectedAuthorId } = get();

    const params: any = { page, limit };
    if (selectedCategoryId) params.categoryId = selectedCategoryId;
    if (selectedCatalogId) params.catalogId = selectedCatalogId;
    if (selectedAuthorId) params.authorId = selectedAuthorId;

    const { data } = await axios.get("https://libdjango.fm64.me/api/v1/books", { params });

    set((state) => {
      const newBooks = append ? [...state.books, ...data.data] : data.data;

      return {
        books: newBooks,
        filteredBooks: newBooks,
        page,                // 👈 сохраняем актуальную страницу
        total: data.total,   // 👈 сохраняем общее количество книг
      };
    });
  },

  fetchCategories: async () => {
    const { data } = await axios.get("https://libdjango.fm64.me/api/v1/categories");
    set({ categories: data.data });
  },

  fetchAuthors: async () => {
    const { data } = await axios.get("https://libdjango.fm64.me/api/v1/authors");
    set({ authors: data.data });
  },

  setCategory: (id) => set({ selectedCategoryId: id }),
  setCatalog: (id) => set({ selectedCatalogId: id }),
  setAuthor: (id) => set({ selectedAuthorId: id }),
}));
