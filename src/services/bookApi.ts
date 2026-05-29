import { bookApiInstance } from "./api";

export const normalizeBook = (b: any) => {
  if (!b) return null;
  return {
    id: b.id !== undefined ? b.id.toString() : "",
    title: b.title || "",
    author: b.author || "",
    price: Number(b.price) || 0,
    description: b.description || "",
    imageUrl: b.image_url || b.imageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    categoryId: b.category_id !== undefined ? b.category_id.toString() : (b.categoryId !== undefined ? b.categoryId.toString() : ""),
    featured: b.featured !== undefined ? b.featured : true,
    stock: b.stock !== undefined ? b.stock : 10,
  };
};

export const deNormalizeBook = (bookData: any) => {
  return {
    title: bookData.title || "",
    author: bookData.author || "",
    description: bookData.description || "",
    image_url: bookData.imageUrl || bookData.image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    price: Number(bookData.price) || 0,
    category_id: Number(bookData.categoryId || bookData.category_id) || 1,
  };
};

export const bookApi = {
  getBooks: async (params?: { search?: string; category?: string; featured?: boolean }) => {
    // Map standard query parameters to the server parameters (e.g. q for search, category_name for category filter)
    const queryParams: any = {
      skip: 0,
      limit: 100, // retrieve enough books
    };
    if (params?.search) {
      queryParams.q = params.search;
    }
    if (params?.category && params.category !== "all") {
      queryParams.category_name = params.category;
    }

    const response = await bookApiInstance.get("books/", { params: queryParams });
    const rawList = Array.isArray(response.data) ? response.data : [];
    
    // Normalize properties so camelCase elements remain compatible
    let books = rawList.map(normalizeBook).filter(Boolean) as any[];

    // Extra local filter layer for maximum reliability
    if (params?.category && params.category !== "all") {
      // Filter by category_id or category_name match
      books = books.filter(
        b => b.categoryId === params.category || 
        b.categoryId?.toLowerCase() === params.category.toLowerCase()
      );
    }
    
    return books;
  },

  getBookById: async (id: string | number) => {
    try {
      const response = await bookApiInstance.get(`books/${id}/`);
      return normalizeBook(response.data);
    } catch {
      const response = await bookApiInstance.get(`books/${id}`);
      return normalizeBook(response.data);
    }
  },

  createBook: async (bookData: any) => {
    const payload = deNormalizeBook(bookData);
    const response = await bookApiInstance.post("books/", payload);
    return normalizeBook(response.data);
  },

  updateBook: async (id: string | number, bookData: any) => {
    const payload = deNormalizeBook(bookData);
    try {
      const response = await bookApiInstance.put(`books/${id}/`, payload);
      return normalizeBook(response.data);
    } catch {
      const response = await bookApiInstance.put(`books/${id}`, payload);
      return normalizeBook(response.data);
    }
  },

  deleteBook: async (id: string | number) => {
    try {
      const response = await bookApiInstance.delete(`books/${id}/`);
      return response.data;
    } catch {
      const response = await bookApiInstance.delete(`books/${id}`);
      return response.data;
    }
  },
};

