import { bookApiInstance } from "./api";

export const normalizeCategory = (c: any) => {
  if (!c) return null;
  return {
    id: c.id !== undefined ? c.id.toString() : "",
    name: c.name || "",
    description: c.description || "",
  };
};

export const categoryApi = {
  getCategories: async (params?: { search?: string }) => {
    const queryParams: any = {
      skip: 0,
      limit: 100
    };
    if (params?.search) {
      queryParams.q = params.search;
    }
    const response = await bookApiInstance.get("categories/", { params: queryParams });
    const rawList = Array.isArray(response.data) ? response.data : [];
    return rawList.map(normalizeCategory).filter(Boolean);
  },

  createCategory: async (categoryData: any) => {
    const response = await bookApiInstance.post("categories/", {
      name: categoryData.name || "",
      description: categoryData.description || ""
    });
    return normalizeCategory(response.data);
  },

  updateCategory: async (id: string | number, categoryData: any) => {
    const payload = {
      name: categoryData.name || "",
      description: categoryData.description || ""
    };
    try {
      const response = await bookApiInstance.put(`categories/${id}/`, payload);
      return normalizeCategory(response.data);
    } catch {
      const response = await bookApiInstance.put(`categories/${id}`, payload);
      return normalizeCategory(response.data);
    }
  },

  deleteCategory: async (id: string | number) => {
    try {
      const response = await bookApiInstance.delete(`categories/${id}/`);
      return response.data;
    } catch {
      const response = await bookApiInstance.delete(`categories/${id}`);
      return response.data;
    }
  },
};

