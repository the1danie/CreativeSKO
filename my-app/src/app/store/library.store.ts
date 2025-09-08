// store/library.store.ts
import { create } from "zustand";
import axios from "axios";

type Category = { id: number; name_en: string; name_ru: string; name_kz: string };
type Catalog = { id: number; title_en: string; title_ru: string; title_kz: string };
type Book = {
  id: number;
  title_en: string;
  title_ru: string;
  title_kz: string;
  category: Category;
  catalog_id: number | null;
  cover_url: string;
  year: number;
  author: { id: number; name_en: string; name_ru: string; name_kz: string };
};

type LibraryStore = {
  books: Book[];
  filteredBooks: Book[];
  categories: Category[];
  catalogs: Catalog[];
  fetchBooks: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCatalogs: () => Promise<void>;
  filterBooks: (categoryId: string | null, catalogId: string | null) => void;
};

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  books: [],
  filteredBooks: [],
  categories: [],
  catalogs: [],

  fetchBooks: async () => {
    const { data } = await axios.get("https://libdjango.fm64.me/api/v1/books");
    set({ books: data.data, filteredBooks: data.data });
  },

  fetchCategories: async () => {
    const { data } = await axios.get("https://libdjango.fm64.me/api/v1/categories");
    set({ categories: data.data }); // ⬅️ именно массив
  },
  
  fetchCatalogs: async () => {
    const { data } = await axios.get("https://libdjango.fm64.me/api/v1/catalogs");
    set({ catalogs: data.data }); // ⬅️ именно массив
  },

  filterBooks: (categoryId, catalogId) => {
    const { books } = get();
    let filtered = books;

    if (categoryId) {
      filtered = filtered.filter((b) => String(b.category.id) === categoryId);
    }
    if (catalogId) {
      filtered = filtered.filter((b) => String(b.catalog_id) === catalogId);
    }

    set({ filteredBooks: filtered });
  },
}));
