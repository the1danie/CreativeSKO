const API_BASE = "https://libdjango.fm64.me/api/v1";

export type LibraryAuthor = {
  id: number;
  name_en: string;
  name_ru: string;
  name_kz: string;
  count: number;
};

export type LibraryCategory = {
  id: number;
  name_en: string;
  name_ru: string;
  name_kz: string;
};

export type LibraryBook = {
  id: number;
  title_en: string;
  title_ru: string;
  title_kz: string;
  author: LibraryAuthor;
  category: LibraryCategory;
  year: number;
  cover_url: string;
  catalog_id: number;
};

export type LibraryBookDetail = LibraryBook & {
  description_en: string;
  description_ru: string;
  description_kz: string;
  download_url: string;
  download_count: number;
};

export type BooksResponse = {
  total: number;
  page: number;
  limit: number;
  meta: {
    sort: string[];
  };
  data: LibraryBook[];
};

export type BooksParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  authorId?: string;
  year?: string;
  sort?: string;
};

export async function fetchBooks(params: BooksParams = {}): Promise<BooksResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params.authorId) searchParams.set('authorId', params.authorId);
  if (params.year) searchParams.set('year', params.year);
  if (params.sort) searchParams.set('sort', params.sort);

  const url = `${API_BASE}/books?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchBookDetail(id: number): Promise<LibraryBookDetail> {
  const url = `${API_BASE}/books/${id}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch book detail: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function getBookStreamUrl(id: number): string {
  return `${API_BASE}/books/${id}/stream`;
}

export function getBookDownloadUrl(id: number): string {
  return `${API_BASE}/books/${id}/download`;
}
